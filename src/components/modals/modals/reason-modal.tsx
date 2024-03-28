import TextArea from '@/components/inputs/text-area';
import { Backdrop, Button, Fade, FormControl, FormControlLabel, Modal, Radio, RadioGroup, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { useId, useRef, useState } from 'react';
import { toast } from 'react-toastify';

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

export interface IReasonModalProps {
    open: boolean;
    setOpen: (v: boolean) => void;
    onOk?: (reason: string) => void;
}

const reason = ['Khách hàng hủy'];

export default function ReasonModal({ open, setOpen, onOk }: IReasonModalProps) {
    const ref = useRef<HTMLTextAreaElement>(null);

    const [value, setValue] = useState(reason[0]);
    const handleClose = () => setOpen(false);

    const id = useId();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue((event.target as HTMLInputElement).value);
    };

    const handleOk = () => {
        if (!onOk) return;

        if (value === 'Khác' && ref.current) {
            if (!value || !ref.current.value.length) {
                toast.warn('Bạn chưa chọn lí do hủy đơn hàng này');
                return;
            }

            onOk(ref.current?.value);
            handleClose();

            return;
        }

        onOk(value);

        handleClose();
    };

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
                        <Typography id={id + 'transition-modal-title'} variant="h6" component="h2">
                            Lí do đơn
                        </Typography>

                        <FormControl
                            sx={{
                                py: '1rem',
                            }}
                        >
                            <RadioGroup onChange={handleChange} value={value} aria-labelledby="demo-radio-buttons-group-label" defaultValue="female" name="radio-buttons-group">
                                {reason.map((item) => {
                                    return <FormControlLabel key={item} value={item} control={<Radio />} label={item} />;
                                })}
                                <FormControlLabel value={'Khác'} control={<Radio />} label={'Khác'} />
                            </RadioGroup>
                        </FormControl>

                        {value === 'Khác' && (
                            <div className="py-4 -mt-4">
                                <TextArea ref={ref} />
                            </div>
                        )}

                        <div className="flex items-center justify-end gap-4">
                            <Button onClick={handleClose} size="small" variant="contained" color="secondary">
                                Hủy
                            </Button>
                            <Button onClick={handleOk} size="small" variant="contained" color="primary">
                                Xác nhận hủy đơn
                            </Button>
                        </div>
                    </Box>
                </Fade>
            </Modal>
        </div>
    );
}
