import { toast } from 'react-toastify';
import { ISize } from '../../interface';

export const max_size = 1024 * 1024 * 2;
export const max_files = 6;

export function filesValidator(files: File[], curFiles: any[]) {
    if (!files.length) {
        toast.warn('Sản phẩm phải có ít nhất một ảnh');
        return true;
    }

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

export const formatNumber = (price: number): string => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    })
        .format(price)
        .replace('₫', '');
};

export const totalQuantities = (sizes: ISize[]) => {
    return sizes.reduce((value, cur) => {
        return (value += cur.price);
    }, 0);
};

export function removeFalsyValues(obj: Record<string, any>): Record<string, any> {
    const newObj: Record<string, any> = {};
    for (const key in obj) {
        if (obj[key]) {
            newObj[key] = obj[key];
        }
    }
    return newObj;
}

export function removeDuplicates(arr1: string[], arr2: string[]): string[] {
    // Create an empty array to store unique elements
    let uniqueArray: string[] = [];

    // Iterate through each element in arr1
    arr1.forEach((item) => {
        // Check if the current element is not present in arr2
        if (!arr2.includes(item)) {
            // If not present, push it to the uniqueArray
            uniqueArray.push(item);
        }
    });

    // Iterate through each element in arr2
    arr2.forEach((item) => {
        // Check if the current element is not present in arr1
        if (!arr1.includes(item)) {
            // If not present, push it to the uniqueArray
            uniqueArray.push(item);
        }
    });

    return uniqueArray;
}
