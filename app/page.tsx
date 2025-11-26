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

    const renderEquipmentSlot = (
        label: string,
        setter: React.Dispatch<React.SetStateAction<EquipmentData | undefined>>,
        value: EquipmentData | undefined,
        ship: ShipData | undefined,
        slotIndex: number
    ) => {
        const equipmentData = ship?.equipment[slotIndex];
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
                <Typography variant="body1">{label}</Typography>
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
                        <Typography variant="body1">Ship</Typography>
                    </Grid>

                    {renderEquipmentSlot('Equipment 1', setEquipment1, equipment1, ship, 0)}
                    {renderEquipmentSlot('Equipment 2', setEquipment2, equipment2, ship, 1)}
                    {renderEquipmentSlot('Equipment 3', setEquipment3, equipment3, ship, 2)}
                    {renderEquipmentSlot('Equipment 4', setEquipment4, equipment4, ship, 3)}
                    <Grid>
                        <Stack spacing={2}>
                            <FormControl fullWidth>
                                <Typography gutterBottom>레벨</Typography>
                                <Slider defaultValue={125} min={1} max={125} />
                            </FormControl>
                            <FormControl fullWidth>
                                <InputLabel id="affinity-label">호감도</InputLabel>
                                <Select
                                    variant="standard"
                                    labelId="affinity-label"
                                    id="affinity"
                                    value=""
                                    label="Affinity"
                                >
                                    <MenuItem value="">Select Affinity</MenuItem>
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
