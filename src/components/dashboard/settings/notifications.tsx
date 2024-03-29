'use client';

import React, { FormEvent, FormEventHandler, SyntheticEvent, useId, useRef } from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { setConfig } from '@/ultils/local-storege';
import Input from '@/components/inputs/input';
import { FormControl, FormLabel, Radio, RadioGroup } from '@mui/material';
import { toCurrency } from '@/ultils/funtions';

export function Notifications(): React.JSX.Element {
    const [maxValue, setmMaxValue] = React.useState(1000000);

    const id = useId();
    const handleSettingShowChart = (e: SyntheticEvent<Element, Event>, checked: boolean) => {
        setConfig('show-chart', String(checked));
    };

    const handleSetMaxValue = (event: React.ChangeEvent<HTMLInputElement>) => {
        setmMaxValue(Number((event.target as HTMLInputElement).value));
        setConfig('max-value-filter', (event.target as HTMLInputElement).value);
    };

    return (
        <form
            onSubmit={(event) => {
                event.preventDefault();
            }}
        >
            <Card>
                <CardHeader title="Cài đặt hệ thống" />
                <Divider />
                <CardContent>
                    <Grid container spacing={6} wrap="wrap">
                        <Grid md={4} sm={6} xs={12}>
                            <Stack spacing={1}>
                                <Typography variant="h6">Sản phẩm</Typography>
                                <FormGroup>
                                    <FormControlLabel onChange={handleSettingShowChart} control={<Checkbox defaultChecked />} label="Hiển thị biểu đồ trong sản phẩm" />
                                </FormGroup>

                                <FormControl>
                                    <FormLabel id={id}>Giá trị tối đa của giá</FormLabel>
                                    <RadioGroup aria-labelledby={id} name={id + 'controlled-radio-buttons-group'} value={maxValue} onChange={handleSetMaxValue}>
                                        <FormControlLabel value={1000000} control={<Radio defaultChecked />} label={toCurrency(1000000)} />
                                        <FormControlLabel value={10000000} control={<Radio />} label={toCurrency(1000000)} />
                                        <FormControlLabel value={100000000} control={<Radio />} label={toCurrency(10000000)} />
                                    </RadioGroup>
                                </FormControl>
                            </Stack>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </form>
    );
}
