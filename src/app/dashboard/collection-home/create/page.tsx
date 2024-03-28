'use client';
import CollectionCreateItem from '@/components/dashboard/collection-home/items/collection-create-item';
import React, { useCallback, useId, useState } from 'react';
import { ICollectionCreateItem } from '../../../../../interface';
import { v4 as uuidv4 } from 'uuid';
import { Button, CircularProgress } from '@mui/material';
import { useConfirm } from 'material-ui-confirm';
import { pustCollections } from '@/apis/handlers/collections';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { paths } from '@/paths';
export interface IConllectionCreatePageProps {}

export default function ConllectionCreatePage(props: IConllectionCreatePageProps) {
    const [items, setItems] = useState<string[]>([uuidv4()]);
    const [itemsData, setItemsData] = useState<ICollectionCreateItem[]>([]);

    const [isLoading, setIsLoading] = useState(false);

    const comfirm = useConfirm();

    const handleAddItem = (key: string) => {
        setItems([...items, uuidv4()]);
    };

    const handleClears = () => {
        setItems([uuidv4()]);
        setItemsData([]);
    };

    const deleteItem = (key: string, data?: ICollectionCreateItem) => {
        const newList = items.filter((i) => i !== key);

        setItems([...newList]);

        if (data) {
            const newList = itemsData.filter((i) => i.id !== data.id);

            setItemsData([...newList]);
        }
    };

    const handleDeleteItem = (key: string, data?: ICollectionCreateItem | null) => {
        if (items.length <= 1 && !itemsData.length) return;

        if (data) {
            const dataFound = itemsData.find((i) => i.id === data.id);

            if (dataFound) {
                comfirm({ title: 'Bạn muốn xóa ảnh này ?' }).then(() => {
                    deleteItem(key, dataFound);

                    if (items.length <= 1 && itemsData.length <= 1) {
                        setItems([uuidv4()]);
                    }
                });
            } else {
                deleteItem(key);
            }
            return;
        }

        // delete item by key
        deleteItem(key);
    };

    const handleSubmitData = (data: ICollectionCreateItem) => {
        setItemsData([...itemsData, data]);
    };

    const handleSubmit = async () => {
        try {
            setIsLoading(true);
            const response = await pustCollections(itemsData);

            if (!response) return toast.warn('Có lỗi xảy ra trong quá trình xử lí. Vui lòng thử lại');

            if (response.status && response.code === 403) {
                return toast.error('Bạn không có quyền sử dụng chức năng này');
            }
            if (response.status && response.code === 402) {
                return;
            }

            handleClears();
            return toast.success(
                <span className="text-justify">
                    {'Lưu thành công'}
                    <Link href={paths.dashboard.collectionHome} className="hover:underline text-blue-600 ml-2">
                        Quay lại trang home
                    </Link>
                </span>,
            );
        } catch (error) {
            console.log(error);
            toast.warn('Có lỗi xảy ra trong quá trình xử lí. Vui lòng thử lại');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section>
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-medium">Tạo ảnh mới</h1>
                <Button onClick={handleSubmit} disabled={!itemsData.length} type="submit" variant="contained">
                    OK
                </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 my-8">
                {items.map((item) => {
                    return (
                        <CollectionCreateItem
                            key={item}
                            index={item}
                            options={{ disabledDelete: items.length <= 1 && itemsData.length <= 0 }}
                            onSubmitData={handleSubmitData}
                            onAddItem={handleAddItem}
                            onDeleteItem={handleDeleteItem}
                        />
                    );
                })}
            </div>

            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-[rgba(0,0,0,.4)]">
                    <CircularProgress />
                </div>
            )}
        </section>
    );
}
