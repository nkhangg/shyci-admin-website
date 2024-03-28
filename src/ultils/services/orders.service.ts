import { comfirmOrder } from '@/apis/handlers/orders';
import { IDOrder, IOrder } from '../../../interface';
import { ConfirmOptions } from 'material-ui-confirm';
import { toast } from 'react-toastify';

export class OrderService {
    static handleComfrimOrder = async (dataMemo: IDOrder | IOrder | null, comfirm: (options?: ConfirmOptions | undefined) => Promise<void>, handelCallApiSucess?: () => void) => {
        if (!dataMemo) return;
        comfirm({ title: 'Xác nhận thanh toán', description: 'Lưu ý: xác nhận thanh toán dùng để tính lợi nhuận' }).then(async () => {
            const response = await comfirmOrder(dataMemo?.id);

            if (!response) return toast.warn('Có lỗi xảy ra trong quá trình xử lí. Vui lòng thử lại');

            if (response.status && response.code === 403) {
                return toast.error('Bạn không có quyền sử dụng chức năng này');
            }
            if (response.status && response.code !== 200) {
                return toast.error(response.message);
            }
            if (response.status && response.code === 402) {
                return;
            }

            toast.success('Xác nhận thành công');

            if (handelCallApiSucess) {
                handelCallApiSucess();
            }
        });
    };
}
