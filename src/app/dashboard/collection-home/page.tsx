'use client';
import React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import RouterLink from 'next/link';
import Typography from '@mui/material/Typography';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { CollectionHomeTable } from '@/components/dashboard/collection-home/tables/collections-table';
import PermissionDenied from '@/components/erorrs/permission-denied';
import { useQuery } from '@tanstack/react-query';
import { collections, deleteCollections } from '@/apis/handlers/collections';
import { useUser } from '@/hooks/use-user';
import { paths } from '@/paths';
import useHandlePagination from '@/hooks/use-handle-pagination';
import { useRouter } from 'next/navigation';
import NotFound from '@/components/erorrs/not-found';

export default function Page(): React.JSX.Element {
    const user = useUser();

    const router = useRouter();

    const baseUrl = paths.dashboard.collectionHome;

    const { page, handleNext, handlePrev } = useHandlePagination({ baseUrl });

    const { data, isError, refetch } = useQuery({
        queryKey: ['get-collections', user.user, page],
        queryFn: () => collections(page),
    });

    return (
        <Stack spacing={3}>
            <Stack direction="row" spacing={3}>
                <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
                    <Typography variant="h4">Collection Home</Typography>
                </Stack>
                <div>
                    <Button
                        component={RouterLink}
                        href={paths.dashboard.collectionHome + `/create`}
                        startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />}
                        variant="contained"
                    >
                        Add
                    </Button>
                </div>
            </Stack>
            {data?.code !== 403 && !isError && data?.data && data.data.items && (
                <CollectionHomeTable
                    deleteFN={deleteCollections}
                    onUpdateSucess={refetch}
                    onDeleteSuccess={() => {
                        refetch();

                        if (page > 1) {
                            router.push(baseUrl);
                        }
                    }}
                    onNext={handleNext}
                    onPrev={handlePrev}
                    data={data.data}
                />
            )}

            {data?.data && data.data.items.length <= 0 && <NotFound />}

            {data?.code === 403 && (
                <div className="my-8">
                    <PermissionDenied />
                </div>
            )}
        </Stack>
    );
}
