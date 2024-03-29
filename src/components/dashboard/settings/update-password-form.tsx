'use client';
import React, { useCallback } from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import { z as zod } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useConfirm } from 'material-ui-confirm';
import { changePasswordAdmin } from '@/apis/handlers/admins';
import { useUser } from '@/hooks/use-user';
import { toast } from 'react-toastify';
import { authClient } from '@/lib/auth/client';
import { FormHelperText } from '@mui/material';
import { useRouter } from 'next/navigation';
import { paths } from '@/paths';
import { logger } from '@/lib/default-logger';

const schema = zod.object({
    oldPassword: zod.string().min(1, { message: 'Mật khẩu cũ bắt buộc' }),
    newPassword: zod.string().min(1, { message: 'Mật khẩu mới bắt buộc' }).min(6, { message: 'Mật khẩu phải lớn hơn 6 kí tự' }),
    comfirmPassword: zod.string().min(1, { message: 'Xác nhận mật khẩu bắt buộc' }).min(6, { message: 'Mật khẩu phải lớn hơn 6 kí tự' }),
});

type Values = zod.infer<typeof schema>;

const defaultValues = { oldPassword: '', newPassword: '', comfirmPassword: '' } satisfies Values;

export function UpdatePasswordForm(): React.JSX.Element {
    const comfirm = useConfirm();
    const router = useRouter();
    const { user, checkSession } = useUser();

    const handleSignOut = useCallback(async (): Promise<void> => {
        try {
            const { error } = await authClient.signOut();

            if (error) {
                logger.error('Sign out error', error);
                return;
            }

            // Refresh the auth state
            await checkSession?.();

            // UserProvider, for this case, will not refresh the router and we need to do it manually
            router.refresh();
            // After refresh, AuthGuard will handle the redirect
        } catch (err) {
            logger.error('Sign out error', err);
        }
    }, [checkSession, router]);

    const {
        control,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });

    const onSubmit = React.useCallback(
        async (values: Values): Promise<void> => {
            if (!user) return;

            if (values.newPassword !== values.comfirmPassword) {
                setError('comfirmPassword', { message: 'Xác nhận không chính xác' });
                return;
            }

            await comfirm({
                title: `Xác nhận cập nhật`,
                description: 'Cập nhật lại mật khẩu cho tài khoản',
            })
                .then(async () => {
                    try {
                        const response = await changePasswordAdmin(user.id, { oldPassword: values.oldPassword, newPassword: values.newPassword });
                        if (!response) {
                            toast.warn('Có lỗi xảy ra trong quá trình xử lí. Vui lòng thử lại');
                            return;
                        }
                        if (response.status && response.code === 403) {
                            toast.error('Bạn không có quyền sử dụng chức năng này');
                            return;
                        }
                        if (response.code !== 200) {
                            toast.warn(response.message);
                            return;
                        }

                        toast.success('Cập nhật thành công');
                        requestIdleCallback(() => {
                            handleSignOut();
                        });
                    } catch (error) {
                        toast.warn('Có lỗi xảy ra trong quá trình xử lí. Vui lòng thử lại');
                    }
                })
                .catch(() => {});
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [comfirm, setError, user],
    );

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Card>
                <CardHeader subheader="Update password" title="Password" />
                <Divider />
                <CardContent>
                    <Stack spacing={3} sx={{ maxWidth: 'sm' }}>
                        <Controller
                            control={control}
                            name="oldPassword"
                            render={({ field }) => (
                                <FormControl error={Boolean(errors.oldPassword)} fullWidth>
                                    <InputLabel>Mật khẩu</InputLabel>
                                    <OutlinedInput {...field} label="Mật khẩu" type="password" />
                                    {errors.oldPassword ? <FormHelperText>{errors.oldPassword.message}</FormHelperText> : null}
                                </FormControl>
                            )}
                        />
                        <Controller
                            control={control}
                            name="newPassword"
                            render={({ field }) => (
                                <FormControl error={Boolean(errors.newPassword)} fullWidth>
                                    <InputLabel>Mật khẩu mới</InputLabel>
                                    <OutlinedInput {...field} label="Mật khẩu mới" name="password" type="password" />
                                    {errors.newPassword ? <FormHelperText>{errors.newPassword.message}</FormHelperText> : null}
                                </FormControl>
                            )}
                        />
                        <Controller
                            control={control}
                            name="comfirmPassword"
                            render={({ field }) => (
                                <FormControl error={Boolean(errors.comfirmPassword)} fullWidth>
                                    <InputLabel>Xác nhận mật khẩu</InputLabel>
                                    <OutlinedInput {...field} label="Xác nhận mật khẩu" name="confirmPassword" type="password" />
                                    {errors.comfirmPassword ? <FormHelperText>{errors.comfirmPassword.message}</FormHelperText> : null}
                                </FormControl>
                            )}
                        />
                    </Stack>
                </CardContent>
                <Divider />
                <CardActions sx={{ justifyContent: 'flex-end' }}>
                    <Button type="submit" variant="contained">
                        Cập nhật
                    </Button>
                </CardActions>
            </Card>
        </form>
    );
}
