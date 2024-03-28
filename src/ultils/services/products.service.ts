import { pushImagesProduct, updateInfoProduct } from '@/apis/handlers/products';
import { IDProduct, IImageProduct, ISize } from '../../../interface';
import { toast } from 'react-toastify';

export class ProductService {
    static async updateInfoProduct(
        data: IDProduct,
        { name, description, showSize, categoriesID }: { name: string; description: string; showSize: boolean; categoriesID: number },
        curentSizes: ISize[],
        images: IImageProduct[],
    ) {
        const response = await updateInfoProduct({ ...data, name, description, showSize, sizes: curentSizes, category: { ...data.category, id: categoriesID + '' } });

        if (!response) {
            toast.warn('Có lỗi xảy ra trong quá trình xử lí. Vui lòng thử lại');
            return false;
        }

        if (response.status && response.code === 403) {
            toast.error('Bạn không có quyền sử dụng chức năng này');
            return false;
        }

        if (response.status && response.code === 400) {
            toast.warn(response.message);
            return false;
        }

        if (response.status && response.code === 402) {
            return false;
        }

        toast.success('Cập nhật thông tin thành công');

        if (images.length) {
            const imagesIncludeFile = images.filter((image) => image.file);

            if (imagesIncludeFile.length) {
                const responseImage = await pushImagesProduct(data.id, imagesIncludeFile);

                if (!response) {
                    toast.warn('Có lỗi xảy ra trong quá trình tải ảnh. Vui lòng thử lại');
                    return false;
                }

                if (response.status && response.code === 402) {
                    return false;
                }

                if (response.status) {
                    toast.warn(response.message);
                    return false;
                }

                toast.success('Cập nhật ảnh thành công');
            }
        }

        return true;
    }
}
