'use client';
import { Button } from '@mui/material';
import { Trash } from '@phosphor-icons/react/dist/ssr';
import React, { ReactNode } from 'react';
import { IAdmin } from '../../../../interface';
import { useUser } from '@/hooks/use-user';
import { toast } from 'react-toastify';
import { deleteAdmin } from '@/apis/handlers/admins';
import { useConfirm } from 'material-ui-confirm';

export interface IButtonDeleteAdminProps {
    data: IAdmin;
    children?: ReactNode;
    loading?: (v: boolean) => void;
    handleWhenSucess?: () => void;
}

export default function ButtonDeleteAdmin({ data, children, loading, handleWhenSucess }: IButtonDeleteAdminProps) {
    const { user } = useUser();
    const comfirm = useConfirm();

    const handleDelete = async () => {
        comfirm({ title: 'Xác nhận xóa', description: 'Tài khoản khi bị xóa sẽ không thể khôi phục' }).then(async () => {
            try {
                if (loading) {
                    loading(true);
                }

                const response = await deleteAdmin(data.id);

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

                toast.success('Xóa thành công');

                requestIdleCallback(() => {
                    if (handleWhenSucess) {
                        handleWhenSucess();
                    }
                });
            } catch (error) {
                toast.error('Có lỗi xảy ra trong quá trình xử lí. Vui lòng thử lại');
            } finally {
                if (loading) {
                    loading(false);
                }
            }
        });
    };

    return (
        <Button
            onClick={handleDelete}
            variant={children ? 'contained' : 'text'}
            color={children ? 'error' : 'inherit'}
            sx={(!children && { color: 'rgb(214,19,85)' }) || {}}
            disabled={user?.id === data.id || !!data?.authorizations?.find((item) => item.role.name === 'root')}
        >
            {!children && <Trash />}

            {children && children}
        </Button>
    );
}
