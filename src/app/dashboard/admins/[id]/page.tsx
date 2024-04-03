'use client';
import { deleteRoleAdmin, getAdmin, getRoles, updateAdmin } from '@/apis/handlers/admins';
import CustomBox from '@/components/common/boxs/custom-box';
import ButtonDeleteAdmin from '@/components/common/buttons-colap/button-delete-admin';
import { constants } from '@/components/common/constants';
import FullpageLoading from '@/components/common/loadings/fullpage-loading';
import Input from '@/components/inputs/input';
import { paths } from '@/paths';
import { Button, Chip, FormControl, FormHelperText } from '@mui/material';
import { Trash } from '@phosphor-icons/react/dist/ssr';
import { useQuery } from '@tanstack/react-query';
import { useConfirm } from 'material-ui-confirm';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { z as zod } from 'zod';
import { IAuthorization, IDropdownData, IRefRolesHandle } from '../../../../../interface';
import useRoles from '@/hooks/use-roles';
import RolesHandle from '@/components/dashboard/admins/roles-handle';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import NotFound from '@/components/erorrs/not-found';

const schema = zod.object({
    fullname: zod.string().min(1, { message: 'Tên không được trống' }),
});

type Values = zod.infer<typeof schema>;

const defaultValues = { fullname: '' } satisfies Values;

export interface IAdminDetailProps {
    params: { id: string };
}

export default function AdminDetail({ params }: IAdminDetailProps) {
    const router = useRouter();

    const refRolesHandle = useRef<IRefRolesHandle>();

    const comfirm = useConfirm();

    const [loading, setLoading] = useState(false);

    const [newRoles, setNewRoles] = useState<IDropdownData[]>([]);

    const roles = useRoles();

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ['get-admins'],
        queryFn: () => getAdmin(params.id),
    });

    const {
        control,
        handleSubmit,
        setError,
        setValue,
        formState: { errors },
    } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });

    const dataMemo = useMemo(() => {
        if ((!data || data.code !== 200) && isError) {
            router.push(paths.dashboard.admins);
            return null;
        }

        if (!data?.data) return null;

        return data.data;

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    const handleWhenDelete = () => {
        router.push(paths.dashboard.admins);
    };

    const handleDeleteRoles = async (data: IAuthorization) => {
        if (!dataMemo) return;

        comfirm({ title: 'Xác nhận xóa quyền hạn', description: 'Bạn sẽ không thể thực thi các tác vụ với các quyền tương ứng' }).then(async () => {
            try {
                const response = await deleteRoleAdmin(dataMemo?.id, data.id as number);

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

                refetch();
            } catch (error) {
                toast.error('Có lỗi xảy ra trong quá trình xử lí');
            }
        });
    };

    const onSubmit = useCallback(
        async (values: Values): Promise<void> => {
            if (!dataMemo) return;
            await comfirm({
                title: `Xác nhận cập nhật`,
                description: newRoles.length > 0 ? `Cập nhật thêm ${newRoles.length} là: ${newRoles.reduce((acc, cur) => (acc += cur.name + ' '), '')}` : undefined,
            })
                .then(async () => {
                    try {
                        const response = await updateAdmin(dataMemo.id, { fullname: values.fullname, roles: newRoles });
                        if (!response) {
                            toast.warn('Có lỗi xảy ra trong quá trình xử lí. Vui lòng thử lại');
                            return;
                        }
                        if (response.status && response.code === 403) {
                            toast.error('Bạn không có quyền sử dụng chức năng này');
                            return;
                        }
                        if (response.code !== 200) {
                            toast.warn('Có lỗi xảy ra trong quá trình xử lí. Vui lòng thử lại');
                            return;
                        }

                        toast.success('Cập nhật thành công');
                        requestIdleCallback(() => {
                            refetch();

                            if (!refRolesHandle.current || !refRolesHandle.current?.reset) return;

                            refRolesHandle.current?.reset();
                        });
                    } catch (error) {
                        toast.warn('Có lỗi xảy ra trong quá trình xử lí. Vui lòng thử lại');
                    }
                })
                .catch(() => {});
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [comfirm, dataMemo, newRoles],
    );

    useEffect(() => {
        if (!dataMemo) return;

        requestIdleCallback(() => {
            setValue('fullname', dataMemo.fullname);
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataMemo]);
    return (
        <section>
            {dataMemo && (
                <form onSubmit={handleSubmit(onSubmit)} className="grid lg:grid-cols-[minmax(900px,_3fr)_2fr] gap-6">
                    <div className="">
                        <CustomBox
                            title="Thông tin cơ bản"
                            classnames={{
                                body: 'flex flex-col gap-4',
                            }}
                        >
                            <Input title="Id" disabled={true} value={dataMemo.id} />
                            <Input title="Tên đăng nhập" disabled={true} value={dataMemo.username} />
                            <Controller
                                control={control}
                                name="fullname"
                                render={({ field }) => (
                                    <FormControl
                                        sx={{
                                            width: '100%',
                                        }}
                                        error={Boolean(errors.fullname)}
                                    >
                                        <Input {...field} title="Tên đầy đủ" />
                                        {errors.fullname ? <FormHelperText>{errors.fullname.message}</FormHelperText> : null}
                                    </FormControl>
                                )}
                            />
                        </CustomBox>
                    </div>
                    <div className="flex flex-col gap-8">
                        <CustomBox title="Thông tin quyền hạn">
                            <div className="flex items-center flex-wrap gap-4">
                                {dataMemo?.authorizations?.map((item) => {
                                    const { label, color } = constants.rolesMap[item.role.name as 'create' | 'read' | 'edit'] ?? {
                                        label: 'Unknown',
                                        color: 'default',
                                    };

                                    return (
                                        <Chip
                                            sx={{
                                                textTransform: 'capitalize',
                                            }}
                                            color={color as 'default' | 'warning' | 'success' | 'error' | 'primary' | 'secondary' | 'info'}
                                            key={item.id}
                                            label={label}
                                            onDelete={['root', 'read'].includes(item.role.name) ? undefined : () => handleDeleteRoles(item)}
                                            size="small"
                                            deleteIcon={<Trash />}
                                        />
                                    );
                                })}
                            </div>
                        </CustomBox>

                        {roles && dataMemo && roles.data && roles.data.length && dataMemo.authorizations.length < roles.data.length && (
                            <RolesHandle refRolesHandle={refRolesHandle} onRoles={(data) => setNewRoles(data)} author={dataMemo.authorizations} data={roles.data} />
                        )}

                        {!isLoading && (
                            <div className="flex items-center justify-center gap-4">
                                <ButtonDeleteAdmin data={dataMemo} loading={setLoading} handleWhenSucess={handleWhenDelete}>
                                    Xóa tài khoản này
                                </ButtonDeleteAdmin>

                                <Button type="submit" variant="contained">
                                    Cập nhật tài khoản
                                </Button>
                            </div>
                        )}
                    </div>
                </form>
            )}

            {data?.code === 404 && <NotFound />}

            {(isLoading || loading) && <FullpageLoading />}
        </section>
    );
}
