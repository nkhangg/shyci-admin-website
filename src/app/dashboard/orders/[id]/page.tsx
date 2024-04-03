'use client';
import CustomBox from '@/components/common/boxs/custom-box';
import Input from '@/components/inputs/input';
import TextArea from '@/components/inputs/text-area';
import { Button, IconButton, List, ListItem, ListItemAvatar, ListItemText, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { DotsThreeVertical as DotsThreeVerticalIcon } from '@phosphor-icons/react/dist/ssr/DotsThreeVertical';
import Chip from '@mui/material/Chip';
import { Box } from '@mui/system';
import dayjs from 'dayjs';
import Link from 'next/link';
import React, { useCallback, useMemo, useState } from 'react';
import { paths } from '@/paths';
import { toCurrency } from '@/ultils/funtions';
import { useQuery } from '@tanstack/react-query';
import FullpageLoading from '@/components/common/loadings/fullpage-loading';
import { acceptOrderDeleteOrder, comfirmOrder, getOrder } from '@/apis/handlers/orders';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { IDOrder, IOrderDetail } from '../../../../../interface';
import NotFound from '@/components/erorrs/not-found';
import CancelOrder from '@/components/dashboard/orders/cancel-order';
import { useConfirm } from 'material-ui-confirm';
import { constants } from '@/components/common/constants';
import { TypeColorChip } from '@/styles/theme/types';
import { OrderService } from '@/ultils/services/orders.service';

export interface IOrderDetailPageProps {
    params: { id: number };
}

export default function OrderDetailPage({ params }: IOrderDetailPageProps) {
    const router = useRouter();
    const { data, isLoading, refetch } = useQuery({
        queryKey: ['get-order', params.id],
        queryFn: () => getOrder(params.id),
    });

    const comfirm = useConfirm();

    const dataMemo = useMemo(() => {
        if (!data) {
            return null;
        }

        if (data.status && data.code === 403) {
            toast.error('Bạn không có quyền sử dụng chức năng này');
            router.push(paths.dashboard.orders);
            return null;
        }

        if (data.status && data.code === 404) {
            toast.error(data.message);

            return null;
        }
        if (data.status && data.code === 402) {
            return null;
        }

        return data.data as IDOrder;
    }, [data, router]);

    const calculateMoney = useCallback((data: IOrderDetail) => {
        const result = data.price * data.quantity * (1 - data.discount / 100);

        return result;
    }, []);

    const calculateTotalProduct = useCallback((data: IOrderDetail[]) => {
        const result = data.reduce((cur, value) => {
            return (cur += value.quantity);
        }, 0);

        return result;
    }, []);

    const calculatePrice = useCallback(
        (data: IOrderDetail[]) => {
            const beforeDiscount = data.reduce((cur, value) => {
                return (cur += value.price * value.quantity);
            }, 0);

            const afterDiscount = data.reduce((cur, value) => {
                return (cur += calculateMoney(value));
            }, 0);

            return {
                beforeDiscount,
                afterDiscount,
            };
        },
        [calculateMoney],
    );

    const handelCallApiSucess = () => {
        refetch();
    };

    const handleAcceptOrder = async () => {
        if (!dataMemo) return;
        comfirm({ title: 'Xác nhận đã nhận được đơn và đang chuẩn bị hàng' }).then(async () => {
            const response = await acceptOrderDeleteOrder(dataMemo?.id);

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
            handelCallApiSucess();
        });
    };

    return (
        <section>
            {dataMemo && !isLoading && data?.code !== 404 && (
                <div className="grid lg:grid-cols-[minmax(900px,_3fr)_2fr] gap-6">
                    <div className="flex flex-col gap-8">
                        <CustomBox
                            actions={
                                <div className="flex items-center gap-4">
                                    {(() => {
                                        const { label, color } = constants.statusMap[dataMemo.state] ?? { label: 'Unknown', color: 'default' };

                                        return <Chip color={color as TypeColorChip} label={label} size="small" />;
                                    })()}
                                    {dataMemo.detail && !dataMemo.detail.payAt && !dataMemo.detail.cancel && (
                                        <Chip color={'secondary'} label={'Chưa xác nhận thanh toán'} size="small" />
                                    )}
                                </div>
                            }
                            title="Thông tin cơ bản"
                            classnames={{ body: 'flex flex-col gap-4' }}
                        >
                            <Input title="Mã đơn hàng" disabled={true} value={dataMemo.id} />
                            <Input title="Tên người nhận" value={dataMemo.fullname} />
                            <Input title="Số điện thoại" value={dataMemo.phone} />
                            <Input title="email" value={dataMemo.email} />
                            <Input title="Đặt ngày" value={dayjs(dataMemo.createdAt).format('DD/MM/YYYY HH:ss')} />
                            <div className="flex flex-col gap-4">
                                <div className="grid grid-cols-3 gap-4">
                                    <Input title="Tỉnh" value={dataMemo.province} />
                                    <Input title="Quận/Huyện" value={dataMemo.district} />
                                    <Input title="Xã/Phường" value={dataMemo.ward} />
                                </div>
                                <Input title="Địa chỉ" value={dataMemo.address} />
                            </div>

                            <TextArea title="Mô tả" rows={6} value={dataMemo.description} />
                        </CustomBox>
                        <CustomBox title="Thông tin sản phẩm" classnames={{ body: 'flex flex-col gap-4' }}>
                            <Box sx={{ overflowX: 'auto' }}>
                                <Table sx={{ minWidth: 800 }}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Mã sản phẩm</TableCell>
                                            <TableCell>Tên sản phẩm</TableCell>
                                            <TableCell align="center">Loại</TableCell>
                                            <TableCell align="center">Giảm giá</TableCell>
                                            <TableCell>Đơn giá</TableCell>
                                            <TableCell align="center">Số lượng</TableCell>
                                            <TableCell>Thành tiền</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {dataMemo.data.map((product, index) => {
                                            return (
                                                <TableRow key={product.id} hover>
                                                    <TableCell>
                                                        <Link
                                                            className="hover:underline hover:text-violet-primary"
                                                            href={paths.dashboard.products + `/${product.size.product?.id}`}
                                                        >
                                                            {product.size.product?.id}
                                                        </Link>
                                                    </TableCell>
                                                    <TableCell>{product.size.product?.name}</TableCell>
                                                    <TableCell align="center">{product.size.name}</TableCell>
                                                    <TableCell align="center">{product.discount}%</TableCell>
                                                    <TableCell>{toCurrency(product.price)}</TableCell>
                                                    <TableCell align="center">{product.quantity}</TableCell>
                                                    <TableCell>{toCurrency(calculateMoney(product))}</TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </Box>
                        </CustomBox>
                    </div>

                    <div className="flex flex-col gap-8">
                        <CustomBox title="Thông tin người mua" classnames={{ body: 'flex flex-col gap-4' }}>
                            <Input title="Id" disabled={true} value={dataMemo.customer.id} />
                            <Input title="Username" value={dataMemo.customer.username} />
                            <Input title="Số điện thoại" value={dataMemo.customer.phone ? dataMemo.customer.phone : 'Chưa cập nhật'} />
                            <Input title="email" value={dataMemo.customer.email ? dataMemo.customer.email : 'Chưa cập nhật'} />
                        </CustomBox>
                        <CustomBox title="Thông tin thanh toán" classnames={{ body: 'flex flex-col gap-4' }}>
                            <span>Tổng sản phẩm: {calculateTotalProduct(dataMemo.data)}</span>
                            {(() => {
                                const value = calculatePrice(dataMemo.data);

                                return (
                                    <>
                                        <span>Giá trước khi giảm: {toCurrency(value.beforeDiscount)}</span>
                                        <span>Giá trước sau giảm: {toCurrency(value.afterDiscount)}</span>
                                    </>
                                );
                            })()}
                            {dataMemo.detail?.payAt && <span>Xác nhận thanh toán lúc: {dayjs(dataMemo.detail.payAt).format('DD/MM/YYYY HH:ss')}</span>}
                        </CustomBox>

                        {dataMemo.detail && dataMemo.detail.cancel && (
                            <CustomBox title="Thông tin hủy đơn" classnames={{ body: 'flex flex-col gap-4' }}>
                                <span>
                                    Lí do: <b>{dataMemo.detail.reason}</b>
                                </span>
                                <span>
                                    Hủy lúc: <b>{dayjs(dataMemo.detail.createdAt).format('DD/MM/YYYY HH:ss')}</b>
                                </span>
                            </CustomBox>
                        )}

                        <div className="w-full flex items-center justify-center gap-4">
                            <CancelOrder onSuccess={handelCallApiSucess} disabled={['refunded'].includes(dataMemo.state) || !!dataMemo.detail?.payAt} id={dataMemo.id} />
                            <Button onClick={handleAcceptOrder} disabled={dataMemo.state !== 'pending'} variant="contained">
                                Lên đơn
                            </Button>
                            {dataMemo.state === 'delivered' && (
                                <Button
                                    onClick={() => OrderService.handleComfrimOrder(dataMemo, comfirm, handelCallApiSucess)}
                                    disabled={!!dataMemo.detail?.payAt}
                                    variant="contained"
                                >
                                    Xác nhận thanh toán
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {!isLoading && !dataMemo && data?.code === 404 && <NotFound />}

            {isLoading && <FullpageLoading />}
        </section>
    );
}
