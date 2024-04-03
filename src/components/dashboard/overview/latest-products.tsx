'use client';
import React, { useMemo } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import RouterLink from 'next/link';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import type { SxProps } from '@mui/material/styles';
import { ArrowRight as ArrowRightIcon } from '@phosphor-icons/react/dist/ssr/ArrowRight';
import { DotsThreeVertical as DotsThreeVerticalIcon } from '@phosphor-icons/react/dist/ssr/DotsThreeVertical';
import dayjs from 'dayjs';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '@/apis/handlers/products';
import { IDProduct } from '../../../../interface';
import { paths } from '@/paths';
import Link from 'next/link';
import NotFound from '@/components/erorrs/not-found';

export interface LatestProductsProps {
    sx?: SxProps;
}

export function LatestProducts({ sx }: LatestProductsProps): React.JSX.Element {
    const { data, isLoading } = useQuery({
        queryKey: ['get product'],
        queryFn: () => getProducts({ limit: 5 }),
    });

    const products = useMemo(() => {
        if (!data || !data.items) return [] as IDProduct[];

        return data.items;
    }, [data]);
    return (
        <Card sx={sx}>
            <CardHeader title="Latest products" />
            <Divider />
            <List>
                {products.length > 0 &&
                    products.map((product, index) => (
                        <ListItem divider={index < products.length - 1} key={product.id}>
                            <ListItemAvatar>
                                {product.images && product.images.length > 0 ? (
                                    <Box component="img" src={product.images[0].name} sx={{ borderRadius: 1, height: '48px', width: '48px', objectFit: 'cover' }} />
                                ) : (
                                    <Box
                                        sx={{
                                            borderRadius: 1,
                                            backgroundColor: 'var(--mui-palette-neutral-200)',
                                            height: '48px',
                                            width: '48px',
                                        }}
                                    />
                                )}
                            </ListItemAvatar>
                            <ListItemText
                                primary={product.name}
                                primaryTypographyProps={{ variant: 'subtitle1' }}
                                secondary={`Updated ${dayjs(product.createdAt).format('MMM D, YYYY')}`}
                                secondaryTypographyProps={{ variant: 'body2' }}
                            />
                            <IconButton edge="end">
                                <Link href={paths.dashboard.products + `/${product.id}`}>
                                    <DotsThreeVerticalIcon weight="bold" />
                                </Link>
                            </IconButton>
                        </ListItem>
                    ))}

                {products.length <= 0 && <NotFound />}
            </List>
            <Divider />
            <CardActions sx={{ justifyContent: 'flex-end' }}>
                <Button
                    component={RouterLink}
                    href={paths.dashboard.products}
                    color="inherit"
                    endIcon={<ArrowRightIcon fontSize="var(--icon-fontSize-md)" />}
                    size="small"
                    variant="text"
                >
                    View all
                </Button>
            </CardActions>
        </Card>
    );
}
