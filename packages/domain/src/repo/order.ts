import { errors } from '@factory';
import { messageApiError, messageFrontError } from '@factory/_constant';
import {
  addRowNumberToError,
  orderCSVSchema,
  SearchOrderType,
} from '@factory/order';
import fs from 'fs';
import { entries, map } from 'lodash';

import { getCSVBody, getCSVHeaders } from '../utils/csvParse';
import { BaseRepository } from './_base';
import { CommonRepository } from './common';

export class OrderRepository extends BaseRepository {
  public readonly model: ACTModels['Order'];
  constructor(db: SQLize) {
    super(db);
    this.model = this.models.Order;
  }
  public async getOrders(dto: SearchOrderType) {
    const { limit, offset } = dto;
    const { rows, count } = await this.model.findAndCountAll({
      include: [
        {
          model: this.models.Customer,
          as: 'customer',
          required: false,
          attributes: ['id', 'name'],
        },
      ],
      limit: limit ? Number(limit) : undefined,
      attributes: [
        ['order_id', 'id'],
        'item_name',
        'item_code',
        'item_quantity',
        'created_date',
        'updated_date',
        'deleted_date',
      ],
      offset: limit && offset ? (offset - 1) * limit : undefined,
      paranoid: false,
    });
    return {
      rows: CommonRepository.findListOrderResponse(rows),
      count,
    };
  }

  public async importOrders(file: Express.Multer.File) {
    const transaction = await this.db.transaction();
    try {
      if (!file) {
        return messageApiError.requiredError('file');
      }

      const headers = await getCSVHeaders(file.path);
      const expectedHeaders = [
        'ID',
        '商品名',
        '商品コード',
        '注文数量',
        '顧客ID',
        'Delete',
      ];
      map(headers, (header, index) => {
        if (expectedHeaders[index] !== header) {
          throw new errors.BadRequestError(messageFrontError.ECL045());
        }
      });

      const dataBody = await getCSVBody(file.path);

      for (const [index, object] of entries(dataBody)) {
        const rowNumber = Number(index) + 2;
        try {
          const validatedRow = orderCSVSchema.validateSync(object, {
            abortEarly: false,
          });

          const { ID, 商品名, 商品コード, 注文数量, 顧客ID, Delete } =
            validatedRow;

          if (ID && ID.trim() !== '') {
            const existingOrder = await this.model.findByPk(ID, {
              transaction,
              paranoid: false,
            });

            if (!existingOrder) {
              throw new errors.BadRequestError(
                addRowNumberToError(messageFrontError.ECL045(), rowNumber),
              );
            }

            if (Delete === 'Y') {
              await existingOrder.destroy({ transaction });
            } else {
              await existingOrder.update(
                {
                  itemName: 商品名,
                  itemCode: 商品コード,
                  itemQuantity: parseInt(注文数量),
                  customerId: 顧客ID,
                  deletedDate: null,
                },
                { transaction },
              );
            }
          } else {
            if (Delete === 'Y') {
              throw new errors.BadRequestError(
                addRowNumberToError(
                  '注文IDなしで削除はできません。',
                  rowNumber,
                ),
              );
            }

            const customer = await this.models.Customer.findByPk(顧客ID, {
              transaction,
              paranoid: false,
            });

            if (!customer) {
              throw new errors.BadRequestError(
                addRowNumberToError(
                  `顧客ID ${顧客ID} が存在しません。`,
                  rowNumber,
                ),
              );
            }

            await this.model.create(
              {
                itemName: 商品名,
                itemCode: 商品コード,
                itemQuantity: parseInt(注文数量),
                customerId: 顧客ID,
              },
              { transaction },
            );
          }
        } catch (error) {
          if (error?.name === 'ValidationError') {
            throw new errors.BadRequestError(
              addRowNumberToError(error.errors.join(','), rowNumber),
            );
          } else {
            throw new errors.BadRequestError(
              addRowNumberToError(messageFrontError.ECL045(), rowNumber),
            );
          }
        }
      }
      await transaction.commit();
      return { success: true };
    } catch (error) {
      transaction.rollback();
      throw new errors.BadRequestError(error.message);
    } finally {
      if (file) {
        fs.unlink(file.path.replace(/\\/g, '/'), () => {});
      }
    }
  }
}
