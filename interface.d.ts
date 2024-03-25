import { User } from '@/types/user';

interface IBaseApi<T> {
    message: string;
    data: T;
    status: boolean;
    code: number;
}

interface IPagination<T> {
    items: T[];
    meta: {
        totalItems: number;
        itemCount: number;
        itemsPerPage: number;
        totalPages: number;
        currentPage: number;
    };
}

interface IRowCollection {
    id: number;
    title: string;
    image: string;
    user: User;
    createdAt: string;
}

interface ICollectionCreateItem {
    id: string;
    file: File | null;
    title: string | null;
}

interface IDropdownData {
    id: string;
    name: string;
    createdAt?: string;
}

interface IImageProduct {
    id: number | string;
    name: string;
    file?: File | null;
    createAt: string;
}

interface ISize {
    createdAt: string;
    id: number | string;
    name: string;
    price: number;
    store: number;
    discount: number;
}

interface IDProduct {
    createdAt: string;
    id: string;
    name: string;
    description: string;
    showSize: boolean;
    sizes: ISize[];
    images: IImageProduct[];
    category: IDropdownData;
}

interface IRefChildImages {
    reset?: () => void;
    init?: (data: IImageProduct[]) => void;
}
