'use client';
import { Backdrop, Box, Fade, Modal, Typography } from '@mui/material';
import React, { ReactNode } from 'react';

export interface IBaseModalProps {
    open: boolean;
    title?: string;
    setOpen: (v: boolean) => void;
    children?: ReactNode;
}

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: '8px',
    p: 4,
};

export default function BaseModal({ open, children, title, setOpen }: IBaseModalProps) {
    const handleClose = () => setOpen(false);

    const id = React.useId();
    return (
        <div>
            <Modal
                aria-labelledby={id + 'transition-modal-title'}
                aria-describedby={id + 'transition-modal-description'}
                open={open}
                onClose={handleClose}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}
            >
                <Fade in={open}>
                    <Box sx={style}>
                        {title && (
                            <Typography id={id + 'transition-modal-title'} variant="h6" component="h2">
                                {title}
                            </Typography>
                        )}

                        {children}
                    </Box>
                </Fade>
            </Modal>
        </div>
    );
}
