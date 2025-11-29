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
    Stack,
    Typography,
    SelectChangeEvent,
    TextField,
    InputAdornment,
    Button,
    IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

export default function Home() {
    const [ships, setShips] = useState<ShipData[]>([]);
    const [equipments, setEquipments] = useState<EquipmentData[]>([]);
    const [CVreload, setCVreload] = useState<number>(42);
    const [CVLreload, setCVLreload] = useState<number>(44);
    const [BBVreload, setBBVreload] = useState<number>(18);

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
        <Container sx={{ py: 4 }}>
            <Stack spacing={2} alignItems="center">
                <Typography variant="h2" component="h1" gutterBottom>
                    Azurlane Cooldown
                </Typography>
                <SelectInfo slot={1} ships={ships} equipments={equipments} />
                <SelectInfo slot={2} ships={ships} equipments={equipments} />
                <SelectInfo slot={3} ships={ships} equipments={equipments} />
                <Card>
                    <CardContent>
                        <TextFieldNumber
                            id="outlined-basic"
                            label="항모 장전작"
                            value={CVreload}
                            setValue={setCVreload}
                            min={0}
                            max={42}
                        />
                        <TextFieldNumber
                            id="outlined-basic"
                            label="경항모 장전작"
                            value={CVLreload}
                            setValue={setCVLreload}
                            min={0}
                            max={44}
                        />
                        <TextFieldNumber
                            id="outlined-basic"
                            label="항전 장전작"
                            value={BBVreload}
                            setValue={setBBVreload}
                            min={0}
                            max={18}
                        />
                    </CardContent>
                </Card>
            </Stack>
        </Container>
    );
}

function SelectInfo({ slot, ships, equipments }: { slot: number; ships: ShipData[]; equipments: EquipmentData[] }) {
    const [ship, setShip] = useState<ShipData | undefined>(undefined);
    const [equipment1, setEquipment1] = useState<EquipmentData | undefined>(undefined);
    const [equipment2, setEquipment2] = useState<EquipmentData | undefined>(undefined);
    const [equipment3, setEquipment3] = useState<EquipmentData | undefined>(undefined);
    const [equipment4, setEquipment4] = useState<EquipmentData | undefined>(undefined);
    const [affinity, setAffinity] = useState<number>(6);
    const [level, setLevel] = useState<number>(125);

    const handleShipChange = (event: SelectChangeEvent) => {
        const selectedShip = ships.find((ship) => ship.name === event.target.value);
        setShip(selectedShip);
        setEquipment1(undefined);
        setEquipment2(undefined);
        setEquipment3(undefined);
        setEquipment4(equipments.find((eq) => eq.id === 1440));
    };

    const renderEquipmentSlot = (
        label: string,
        setter: React.Dispatch<React.SetStateAction<EquipmentData | undefined>>,
        value: EquipmentData | undefined,
        ship: ShipData | undefined,
        slotIndex: number
    ) => {
        const equipmentData = ship?.equipment[slotIndex];
        const equipName: { [key: number]: string } = {
            2: '대공포',
            6: '경순포',
            7: '전투기',
            8: '뇌격기',
            9: '폭격기',
            10: '설비',
        };
        let equipmentText = '\u00A0';

        const allowedTypes = [7, 8, 9, 10];
        const isDisabled = !ship || (equipmentData && !equipmentData.type.some((t) => allowedTypes.includes(t)));

        if (equipmentData) {
            if (equipmentData.type.includes(10)) {
                equipmentText = '설비';
            } else if (equipmentData.type.some((t) => allowedTypes.includes(t))) {
                const retrofitBonusKey = `equipment_proficiency_${slotIndex}`;
                const retrofitBonus = ship?.retrofit?.bonus?.[retrofitBonusKey] || 0;
                const efficiency = equipmentData.efficiency + retrofitBonus;
                const slotEquipName =
                    equipmentData.type.length > 1
                        ? equipmentData.type.map((type) => equipName[type].at(0)).join(' ')
                        : equipName[equipmentData.type[0]];
                equipmentText = `${slotEquipName} ${Math.round(efficiency * 100)}% x ${equipmentData.mount}`;
            } else {
                equipmentText = '특수 장비';
            }
        }
        return (
            <Grid>
                <Stack spacing={1} alignItems="center">
                    <FormControl sx={{ width: 160 }} disabled={isDisabled}>
                        <InputLabel id={`${label}-label`}>{label}</InputLabel>
                        <Select
                            labelId={`${label}-label`}
                            id={label}
                            value={value?.name || ''}
                            label={label}
                            onChange={(e) => setter(equipments.find((eq) => eq.name === e.target.value))}
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
                        src={value ? `/image/equipments/${value.id}.png` : '/image/placeholder/placeholder_equip.png'}
                        alt="placeholder"
                        sx={{
                            width: 160,
                            height: 160,
                            borderRadius: 1,
                            objectFit: 'scale-down',
                            backgroundSize: 'cover',
                            backgroundImage: `url(${value ? `/image/rarity/rarity_bg_${value.rarity}.png` : ''})`,
                        }}
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
                            <FormControl sx={{ width: 160 }}>
                                <InputLabel id="ship-label">Ship</InputLabel>
                                <Select
                                    labelId="ship-label"
                                    id="ship"
                                    value={ship?.name || ''}
                                    onChange={(e) => handleShipChange(e)}
                                    sx={{ width: 160 }}
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
                                src={
                                    ship
                                        ? `/image/ships/${ship.name}.png`
                                        : `/image/placeholder/placeholder_ship${slot}.png`
                                }
                                alt="placeholder"
                                sx={{
                                    width: 160,
                                    height: 160,
                                    borderRadius: 1,
                                    backgroundSize: 'cover',
                                    backgroundImage: `url(${ship ? (ship.retrofit ? `/image/rarity/rarity_bg_${ship.rarity + 1}.png` : `/image/rarity/rarity_bg_${ship.rarity}.png`) : ''})`,
                                }}
                            />
                        </Stack>
                        <Typography variant="body1" sx={{ textAlign: 'center' }}>
                            {ship ? ship.name_kr : '\u00A0'}
                        </Typography>
                    </Grid>

                    {renderEquipmentSlot('Equipment 1', setEquipment1, equipment1, ship, 1)}
                    {renderEquipmentSlot('Equipment 2', setEquipment2, equipment2, ship, 2)}
                    {renderEquipmentSlot('Equipment 3', setEquipment3, equipment3, ship, 3)}
                    {renderEquipmentSlot('Equipment 4', setEquipment4, equipment4, ship, 4)}
                    <Grid alignSelf="flex-start">
                        <Stack spacing={2}>
                            <FormControl sx={{ width: 160 }}>
                                <InputLabel id="level-label">레벨</InputLabel>
                                <Select
                                    labelId="level-label"
                                    id="level"
                                    value={level}
                                    label="레벨"
                                    onChange={(e) => setLevel(e.target.value as number)}
                                >
                                    <MenuItem value={100}>100</MenuItem>
                                    <MenuItem value={120}>120</MenuItem>
                                    <MenuItem value={125}>125</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl sx={{ width: 160 }}>
                                <InputLabel id="affinity-label">호감도</InputLabel>
                                <Select
                                    labelId="affinity-label"
                                    id="affinity"
                                    value={affinity}
                                    label="호감도"
                                    onChange={(e) => setAffinity(e.target.value as number)}
                                >
                                    <MenuItem value={1}>50 (1%)</MenuItem>
                                    <MenuItem value={3}>90 (3%)</MenuItem>
                                    <MenuItem value={6}>100 (6%)</MenuItem>
                                    <MenuItem value={9}>150 (9%)</MenuItem>
                                    <MenuItem value={12}>200 (12%)</MenuItem>
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

function TextFieldNumber({
    id,
    label,
    value,
    setValue,
    min,
    max,
}: {
    id: string;
    label: string;
    value: number;
    setValue: React.Dispatch<React.SetStateAction<number>>;
    min?: number;
    max?: number;
}) {
    const handleIncrement = () => {
        if (max !== undefined && value >= max) {
            return;
        }
        setValue(value + 1);
    };
    const handleDecrement = () => {
        if (min !== undefined && value <= min) {
            return;
        }
        setValue(value - 1);
    };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = e.target.value;
        if (value === '' || /^[0-9\b]+$/.test(value)) {
            if (min !== undefined && Number(value) < min) {
                setValue(min);
            } else if (max !== undefined && Number(value) > max) {
                setValue(max);
            } else {
                setValue(Number(value));
            }
        }
    };
    return (
        <TextField
            id={id}
            label={label}
            variant="outlined"
            value={value}
            onChange={(e) => handleChange(e)}
            sx={{ width: 136 }}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton onClick={handleDecrement}>
                            <RemoveIcon />
                        </IconButton>
                        <IconButton onClick={handleIncrement}>
                            <AddIcon />
                        </IconButton>
                    </InputAdornment>
                ),
            }}
        />
    );
}
