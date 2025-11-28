'use client';

import React, { useEffect, useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Container,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    Slider,
    Stack,
    Typography,
} from '@mui/material';

export default function Home() {
    const [ships, setShips] = useState<ShipData[]>([]);
    const [equipments, setEquipments] = useState<EquipmentData[]>([]);

    useEffect(() => {
        const fetchJSON = async () => {
            try {
                const responseShip = await fetch('/ships.json');
                const responseEquip = await fetch('/equipments.json');

                const shipData = await responseShip.json();
                const equipData = await responseEquip.json();

                setShips(shipData);
                setEquipments(equipData);
            } catch (error) {
                console.error('Error fetching ships:', error);
            }
        };

        fetchJSON();
    }, []);

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Stack spacing={4} alignItems="center">
                <Typography variant="h2" component="h1" gutterBottom>
                    Azurlane Cooldown
                </Typography>
                <SelectInfo ships={ships} equipments={equipments} />
                <SelectInfo ships={ships} equipments={equipments} />
                <SelectInfo ships={ships} equipments={equipments} />
            </Stack>
        </Container>
    );
}

function SelectInfo({ ships, equipments }: { ships: ShipData[]; equipments: EquipmentData[] }) {
    const [ship, setShip] = useState<ShipData | undefined>(undefined);
    const [equipment1, setEquipment1] = useState<EquipmentData | undefined>(undefined);
    const [equipment2, setEquipment2] = useState<EquipmentData | undefined>(undefined);
    const [equipment3, setEquipment3] = useState<EquipmentData | undefined>(undefined);
    const [equipment4, setEquipment4] = useState<EquipmentData | undefined>(undefined);
    const [affinity, setAffinity] = useState<number>(100);
    const [level, setLevel] = useState<number>(1);

    const renderEquipmentSlot = (
        label: string,
        setter: React.Dispatch<React.SetStateAction<EquipmentData | undefined>>,
        value: EquipmentData | undefined,
        ship: ShipData | undefined,
        slotIndex: number
    ) => {
        const equipmentData = ship?.equipment[slotIndex];
        const equipName = { 7: '전투기', 8: '뇌격기', 9: '폭격기', 10: '설비' };
        let equipmentText = '';

        if (equipmentData && !equipmentData?.type.includes(10)) {
            const retrofitBonusKey = `equipment_proficiency_${slotIndex}`;
            const retrofitBonus = ship?.retrofit?.bonus?.[retrofitBonusKey] || 0;
            const efficiency = equipmentData.efficiency + retrofitBonus;
            const slotEquipName =
                equipmentData.type.length > 1
                    ? equipmentData.type.map((type) => equipName[type].at(0)).join(' ')
                    : equipName[equipmentData.type[0]];
            equipmentText = `${slotEquipName} ${efficiency * 100}% x ${equipmentData.mount}`;
        } else if (equipmentData?.type.includes(10)) {
            equipmentText = '설비';
        }
        return (
            <Grid>
                <Stack spacing={1} alignItems="center">
                    <FormControl fullWidth>
                        <InputLabel id={`${label}-label`}>{label}</InputLabel>
                        <Select
                            labelId={`${label}-label`}
                            id={label}
                            value={value?.name || ''}
                            label={label}
                            onChange={(e) => setter(equipments.find((eq) => eq.name === e.target.value))}
                            disabled={!ship}
                        >
                            {equipments
                                .filter((item) => equipmentData && equipmentData.type.includes(item.type))
                                .map((item) => (
                                    <MenuItem key={item.name} value={item.name}>
                                        {item.name_kr}
                                    </MenuItem>
                                ))}
                        </Select>
                    </FormControl>
                    <Box
                        component="img"
                        src="https://placehold.co/160x160"
                        alt="placeholder"
                        sx={{ width: 160, height: 160, borderRadius: 1, objectFit: 'cover' }}
                    />
                </Stack>
                <Typography variant="body1" sx={{ textAlign: 'center' }}>
                    {equipmentText}
                </Typography>
            </Grid>
        );
    };

    return (
        <Card sx={{ width: '100%' }}>
            <CardContent>
                <Grid container spacing={2} alignItems="center">
                    <Grid>
                        <Stack spacing={1} alignItems="center">
                            <FormControl fullWidth>
                                <InputLabel id="ship-label">Ship</InputLabel>
                                <Select
                                    labelId="ship-label"
                                    id="ship"
                                    value={ship?.name || ''}
                                    onChange={(e) => setShip(ships.find((s) => s.name === e.target.value))}
                                >
                                    {ships.map((item) => (
                                        <MenuItem key={item.name} value={item.name}>
                                            {item.name_kr}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <Box
                                component="img"
                                src="https://placehold.co/160x160"
                                alt="placeholder"
                                sx={{ width: 160, height: 160, borderRadius: 1, objectFit: 'cover' }}
                            />
                        </Stack>
                        <Typography variant="body1" sx={{ textAlign: 'center' }}>
                            {ship ? ship.name_kr : ''}
                        </Typography>
                    </Grid>

                    {renderEquipmentSlot('Equipment 1', setEquipment1, equipment1, ship, 1)}
                    {renderEquipmentSlot('Equipment 2', setEquipment2, equipment2, ship, 2)}
                    {renderEquipmentSlot('Equipment 3', setEquipment3, equipment3, ship, 3)}
                    {renderEquipmentSlot('Equipment 4', setEquipment4, equipment4, ship, 4)}
                    <Grid size={2}>
                        <Stack spacing={2}>
                            <FormControl fullWidth>
                                <Typography gutterBottom>레벨 {level}</Typography>
                                <Slider
                                    defaultValue={125}
                                    min={1}
                                    max={125}
                                    marks={[
                                        { value: 1, label: '1' },
                                        { value: 100, label: '100' },
                                        { value: 120, label: '120' },
                                    ]}
                                    size="small"
                                    valueLabelDisplay="auto"
                                    onChange={(e) => setLevel(e.target.value)}
                                />
                            </FormControl>
                            <FormControl fullWidth>
                                <InputLabel id="affinity-label">호감도</InputLabel>
                                <Select
                                    variant="standard"
                                    labelId="affinity-label"
                                    id="affinity"
                                    defaultValue={200}
                                    label="Affinity"
                                    onChange={(e) => setAffinity(e.target.value)}
                                >
                                    <MenuItem value={100}>100</MenuItem>
                                    <MenuItem value={200}>200</MenuItem>
                                </Select>
                            </FormControl>
                            <Typography variant="body1">장비창 공습쿨: </Typography>
                            <Typography variant="body1">실제 공습쿨: </Typography>
                        </Stack>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}
