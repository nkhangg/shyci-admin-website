'use client';
import { acceptOrderDeleteOrder } from '@/apis/handlers/orders';
import ReasonModal from '@/components/modals/modals/reason-modal';
import { Button } from '@mui/material';
import { useConfirm } from 'material-ui-confirm';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

export interface ICancelOrderProps {
    id: number;
    disabled?: boolean;
    onSuccess?: () => void;
}

export default function CancelOrder({ id, disabled = false, onSuccess }: ICancelOrderProps) {
    const [openModal, setOpenModal] = useState(false);

    const comfirm = useConfirm();

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleCancelOrder = async (reason: string) => {
        comfirm({ title: 'Bạn muốn hủy đơn với lí do: ' + reason, description: 'Lưu ý đơn khi hủy sẽ không thể khôi phục' }).then(async () => {
            const response = await acceptOrderDeleteOrder(id, reason);

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

            toast.success('Hủy thành công');

            if (onSuccess) {
                onSuccess();
            }
        });
    };

    return (
        <>
            <Button disabled={disabled} onClick={handleOpenModal} variant="contained" color="secondary">
                Hủy đơn
            </Button>

            <ReasonModal onOk={handleCancelOrder} open={openModal} setOpen={setOpenModal} />
        </>
    );
}
