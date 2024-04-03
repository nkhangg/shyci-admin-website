'use client';
import CustomBox from '@/components/common/boxs/custom-box';
import RolesHandle from '@/components/dashboard/admins/roles-handle';
import Input from '@/components/inputs/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, FormControl, FormHelperText } from '@mui/material';
import React, { useCallback, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';
import { IDropdownData, IRefRolesHandle } from '../../../../../interface';
import { useConfirm } from 'material-ui-confirm';
import useRoles from '@/hooks/use-roles';
import { createAdmin } from '@/apis/handlers/admins';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { paths } from '@/paths';

const schema = zod.object({
    fullname: zod.string().min(1, { message: 'Tên không được trống' }),
    username: zod.string().min(1, { message: 'Tên đăng nhập không được trống' }),
    password: zod.string().min(1, { message: 'Mật khẩu không được trống' }).min(6, { message: 'Mật khẩu phải dài hơn 6 kí tự' }),
    comfirmPassword: zod.string().min(1, { message: 'Mật khẩu không được trống' }).min(6, { message: 'Mật khẩu phải dài hơn 6 kí tự' }),
});

type Values = zod.infer<typeof schema>;

const defaultValues = { fullname: '', comfirmPassword: '', password: '', username: '' } satisfies Values;

export interface ICreateAdminPageProps {}

export default function CreateAdminPage(props: ICreateAdminPageProps) {
    const refRolesHandle = useRef<IRefRolesHandle>();

    const router = useRouter();

    const [newRoles, setNewRoles] = useState<IDropdownData[]>([]);

    const comfirm = useConfirm();

    const roles = useRoles();

    const {
        control,
        handleSubmit,
        setError,
        setValue,
        formState: { errors },
    } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });

    const onSubmit = useCallback(
        async (values: Values): Promise<void> => {
            console.log(newRoles);
            if (values.password != values.comfirmPassword) {
                setError('comfirmPassword', { message: 'Xác nhận mật khẩu không chính xác' });
                return;
            }

            await comfirm({
                title: `Xác nhận tạo tài khoản`,
                description:
                    newRoles.length > 0
                        ? `Tài khoản có ${newRoles.length} quyền là: ${newRoles.reduce((acc, cur) => (acc += cur.name + ' '), '')} và một quyền mặc định`
                        : 'Tài khoản có quyền mặc định là đọc (Read)',
            })
                .then(async () => {
                    try {
                        const { comfirmPassword, ...prevValues } = values;
                        const response = await createAdmin({ ...prevValues, roles: newRoles });
                        if (!response) {
                            toast.warn('Có lỗi xảy ra trong quá trình xử lí. Vui lòng thử lại');
                            return;
                        }
                        if (response.status && response.code === 403) {
                            toast.error('Bạn không có quyền sử dụng chức năng này');
                            return;
                        }
                        if (response.code !== 201) {
                            toast.warn(response.message);
                            return;
                        }
                        toast.success('Cập nhật thành công');
                        requestIdleCallback(() => {
                            router.push(paths.dashboard.admins + `/${response.data.id}`);
                        });
                    } catch (error) {
                        toast.warn('Có lỗi xảy ra trong quá trình xử lí. Vui lòng thử lại');
                    }
                })
                .catch(() => {});
        },
        [comfirm, newRoles, router, setError],
    );

    return (
        <section>
            <form onSubmit={handleSubmit(onSubmit)} className="grid lg:grid-cols-[minmax(900px,_3fr)_2fr] gap-6">
                <div className="">
                    <CustomBox
                        title="Thông tin cơ bản"
                        classnames={{
                            body: 'flex flex-col gap-4',
                        }}
                    >
                        <Controller
                            control={control}
                            name="username"
                            render={({ field }) => (
                                <FormControl
                                    sx={{
                                        width: '100%',
                                    }}
                                    error={Boolean(errors.username)}
                                >
                                    <Input {...field} title="Tên đăng nhập" />
                                    {errors.username ? <FormHelperText>{errors.username.message}</FormHelperText> : null}
                                </FormControl>
                            )}
                        />
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

                        <Controller
                            control={control}
                            name="password"
                            render={({ field }) => (
                                <FormControl
                                    sx={{
                                        width: '100%',
                                    }}
                                    error={Boolean(errors.password)}
                                >
                                    <Input {...field} title="Mật khẩu" type="password" />
                                    {errors.password ? <FormHelperText>{errors.password.message}</FormHelperText> : null}
                                </FormControl>
                            )}
                        />

                        <Controller
                            control={control}
                            name="comfirmPassword"
                            render={({ field }) => (
                                <FormControl
                                    sx={{
                                        width: '100%',
                                    }}
                                    error={Boolean(errors.comfirmPassword)}
                                >
                                    <Input {...field} title="Xác nhận mật khẩu" type="password" />
                                    {errors.comfirmPassword ? <FormHelperText>{errors.comfirmPassword.message}</FormHelperText> : null}
                                </FormControl>
                            )}
                        />
                    </CustomBox>
                </div>
                <div className="flex flex-col gap-8">
                    <RolesHandle options={{ showDescription: true }} refRolesHandle={refRolesHandle} onRoles={(data) => setNewRoles(data)} author={[]} data={roles.data} />

                    {!false && (
                        <div className="flex items-center justify-center gap-4">
                            <Button type="submit" variant="contained">
                                Tạo tài khoản admin
                            </Button>
                        </div>
                    )}
                </div>
            </form>
        </section>
    );
}
