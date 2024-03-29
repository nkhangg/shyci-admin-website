'use client';
import CustomBox from '@/components/common/boxs/custom-box';
import Dropdown from '@/components/inputs/dropdown';
import React, { MutableRefObject, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { IAuthorization, IDropdownData, IRefRolesHandle } from '../../../../interface';
import { toast } from 'react-toastify';
import { Chip, capitalize } from '@mui/material';

export interface IRolesHandleProps {
    author: IAuthorization[];
    data: IDropdownData[];
    onRoles?: (data: IDropdownData[]) => void;
    refRolesHandle?: MutableRefObject<IRefRolesHandle | undefined>;
}

export default function RolesHandle({ data, author, refRolesHandle, onRoles }: IRolesHandleProps) {
    const [rolesData, setRolesData] = useState<IDropdownData[]>([]);

    const handleChange = (value: number) => {
        const foud = author.find((item) => item.role.id === value);

        if (foud) {
            toast.warn('Quyền đã tồn tại');
            return;
        }

        const newValue = data.find((item) => item.id == value + '');

        if (!newValue) return;

        setRolesData([...rolesData, newValue]);
    };

    const handleClose = (item: IDropdownData) => {
        const newValue = rolesData.filter((i) => i.id !== item.id);

        setRolesData(newValue);
    };

    useEffect(() => {
        if (onRoles) {
            onRoles(rolesData);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rolesData]);

    useImperativeHandle(refRolesHandle, () => {
        return {
            reset: () => {
                setRolesData([]);
            },
        };
    });

    return (
        <CustomBox title="Thêm quyền cho tài khoản">
            <div className="flex items-center flex-wrap gap-4">
                <Dropdown
                    onChange={(e) => {
                        handleChange(Number(e.target.value));
                    }}
                    showAllItem={false}
                    title="Quyền hạn"
                    data={data}
                />

                {rolesData.length > 0 && (
                    <div className="flex items-center gap-4">
                        {rolesData.map((item, index) => {
                            return <Chip key={index} onDelete={() => handleClose(item)} label={capitalize(item.name)} />;
                        })}
                    </div>
                )}
            </div>
        </CustomBox>
    );
}
