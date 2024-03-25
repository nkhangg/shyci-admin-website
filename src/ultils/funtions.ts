import { toast } from 'react-toastify';

export const max_size = 1024 * 1024 * 2;
export const max_files = 6;

export function filesValidator(files: File[], curFiles: any[]) {
    if (!files.length) {
        toast.warn('Sản phẩm phải có ít nhất một ảnh');
        return true;
    }

    console.log(curFiles.length >= max_files, curFiles.length);

    if (files.length > max_files || curFiles.length >= max_files) {
        toast.warn(`Sản phẩm phải có tối đa ${max_files} ảnh`);
        return true;
    }

    const check = files.some((file) => file.size > max_size);

    if (check) {
        toast.warn('Ảnh không lớn hơn 2 mb');
    }

    return check;
}

export const toCurrency = (price: number): string => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(price);
};
