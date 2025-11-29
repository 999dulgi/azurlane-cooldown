'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
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
    Tooltip,
    IconButton,
    Checkbox,
    FormControlLabel,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import InfoIcon from '@mui/icons-material/Info';

export default function Home() {
    const [ships, setShips] = useState<ShipData[]>([]);
    const [equipments, setEquipments] = useState<EquipmentData[]>([]);
    const [CVreload, setCVreload] = useState<number>(42);
    const [CVLreload, setCVLreload] = useState<number>(44);
    const [commander, setCommander] = useState<boolean>(false);
    const [commanderReload, setCommanderReload] = useState<number>(0);
    const [supporter, setSupporter] = useState<boolean>(false);
    const [result1, setResult1] = useState<number>(0);
    const [result2, setResult2] = useState<number>(0);
    const [result3, setResult3] = useState<number>(0);

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
        <Container sx={{ py: 4 }} maxWidth="xl">
            <Typography variant="h2" component="h1" gutterBottom textAlign="center">
                Azurlane Cooldown
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, justifyContent: 'center' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <SelectInfo
                        slot={1}
                        ships={ships}
                        equipments={equipments}
                        result={result1}
                        setResult={setResult1}
                        CVReload={CVreload}
                        CVLReload={CVLreload}
                        commander={commander}
                        commanderReload={commanderReload}
                        supporter={supporter}
                    />
                    <SelectInfo
                        slot={2}
                        ships={ships}
                        equipments={equipments}
                        result={result2}
                        setResult={setResult2}
                        CVReload={CVreload}
                        CVLReload={CVLreload}
                        commander={commander}
                        commanderReload={commanderReload}
                        supporter={supporter}
                    />
                    <SelectInfo
                        slot={3}
                        ships={ships}
                        equipments={equipments}
                        result={result3}
                        setResult={setResult3}
                        CVReload={CVreload}
                        CVLReload={CVLreload}
                        commander={commander}
                        commanderReload={commanderReload}
                        supporter={supporter}
                    />
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Card>
                        <CardContent>
                            <Stack spacing={2} alignItems="center">
                                <TextFieldNumber
                                    id="cv-outlined"
                                    label="항모 장전작"
                                    value={CVreload}
                                    setValue={setCVreload}
                                    min={0}
                                    max={42}
                                />
                                <TextFieldNumber
                                    id="cvl-outlined"
                                    label="경항모 장전작"
                                    value={CVLreload}
                                    setValue={setCVLreload}
                                    min={0}
                                    max={45}
                                />
                                <FormControl sx={{ width: 136 }}>
                                    <InputLabel id="commander-select-label">지휘냥</InputLabel>
                                    <Select
                                        labelId="commander-select-label"
                                        id="commander-select"
                                        value={commander ? 1 : 0}
                                        label="지휘냥"
                                        onChange={(e) => setCommander(e.target.value ? true : false)}
                                    >
                                        <MenuItem value={0}>미사용</MenuItem>
                                        <MenuItem value={1}>사용</MenuItem>
                                    </Select>
                                </FormControl>
                                <TextFieldNumber
                                    id="commander-outlined"
                                    label="지휘냥 장전"
                                    value={commanderReload}
                                    setValue={setCommanderReload}
                                    disabled={!commander}
                                    min={0}
                                    max={40}
                                />
                                <FormControl sx={{ width: 136 }}>
                                    <InputLabel id="supporter-select-label">하늘의 서포터</InputLabel>
                                    <Select
                                        labelId="supporter-select-label"
                                        id="supporter-select"
                                        value={supporter ? 1 : 0}
                                        label="하늘의 서포터"
                                        onChange={(e) => setSupporter(e.target.value === 1 ? true : false)}
                                    >
                                        <MenuItem value={0}>미사용</MenuItem>
                                        <MenuItem value={1}>사용</MenuItem>
                                    </Select>
                                </FormControl>
                            </Stack>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent>
                            <Box sx={{ position: 'relative', width: '100%' }}>
                                <Image
                                    src="/image/hammann/hammann-.png"
                                    alt="hammann-"
                                    width={512}
                                    height={512}
                                    style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
                                />
                            </Box>
                        </CardContent>
                    </Card>
                </Box>
            </Box>
        </Container>
    );
}

function SelectInfo({
    slot,
    ships,
    equipments,
    result,
    setResult,
    CVReload,
    CVLReload,
    commander,
    commanderReload,
    supporter,
}: {
    slot: number;
    ships: ShipData[];
    equipments: EquipmentData[];
    result: number;
    setResult: React.Dispatch<React.SetStateAction<number>>;
    CVReload: number;
    CVLReload: number;
    commander: boolean;
    commanderReload: number;
    supporter: boolean;
}) {
    const [ship, setShip] = useState<ShipData | undefined>(undefined);
    const [equipment1, setEquipment1] = useState<EquipmentData | undefined>(undefined);
    const [equipment2, setEquipment2] = useState<EquipmentData | undefined>(undefined);
    const [equipment3, setEquipment3] = useState<EquipmentData | undefined>(undefined);
    const [equipment4, setEquipment4] = useState<EquipmentData | undefined>(undefined);
    const [affinity, setAffinity] = useState<number>(6);
    const [level, setLevel] = useState<number>(125);

    useEffect(() => {
        if (!ship || !equipment1 || !equipment2 || !equipment3 || !equipment4) {
            return;
        }

        const statReload = Math.floor(
            (ship.base_reload + (ship.growth_reload * (level - 1)) / 1000 + (ship.enhance_reload || 0)) *
                (1 + affinity / 100) +
                (ship.retrofit?.bonus?.reload || 0)
        );

        let shipReload = statReload + (commander ? commanderReload : 0) + (ship.type === 7 ? CVReload : CVLReload);

        if (ship?.name === 'Implacable') {
            if (equipment3.type === 9) {
                shipReload = Math.floor(shipReload * 1.1);
            }
        } else if (ship?.name === 'August von Parseval') {
            if (
                equipment1.id === 47140 ||
                equipment1.id === 47160 ||
                equipment1.id === 47180 ||
                equipment1.id === 47200 ||
                equipment3.id === 48040
            ) {
                shipReload = Math.floor(shipReload * 1.12);
            }
        }

        const calcPlaneCooldown = (equipment: EquipmentData) => {
            return (equipment?.reload || 1) / 6 / Math.sqrt((shipReload + 100) * Math.PI);
        };

        const planeCooldown1 = calcPlaneCooldown(equipment1) * ship.equipment[1].mount;
        const planeCooldown2 = calcPlaneCooldown(equipment2) * ship.equipment[2].mount;
        const planeCooldown3 = ship.equipment[3].type.includes(2)
            ? 0
            : calcPlaneCooldown(equipment3) * ship.equipment[3].mount;

        const totalPlane =
            ship.equipment[1].mount +
            ship.equipment[2].mount +
            (ship.equipment[3].type.includes(2) ? 0 : ship.equipment[3].mount);
        const totalPlaneCooldown = planeCooldown1 + planeCooldown2 + planeCooldown3;

        const finalCooldown = (totalPlaneCooldown / totalPlane) * 2.2 + 0.033;

        setResult(Number(finalCooldown.toFixed(2)));
    }, [
        ship,
        equipment1,
        equipment2,
        equipment3,
        equipment4,
        affinity,
        level,
        commander,
        commanderReload,
        CVReload,
        CVLReload,
        setResult,
    ]);

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
                            objectFit: value ? 'scale-down' : 'contain',
                            backgroundSize: 'cover',
                            backgroundImage: `url(${value ? `/image/rarity/rarity_bg_${value.rarity}.png` : '/image/rarity/rarity_bg_5.png'})`,
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
        <Card>
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
                            <Typography variant="body1">장비창 공습쿨: {result} </Typography>
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
    disabled = false,
    min,
    max,
}: {
    id: string;
    label: string;
    value: number;
    setValue: React.Dispatch<React.SetStateAction<number>>;
    disabled?: boolean;
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
            disabled={disabled}
            sx={{ width: 136 }}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton
                            onClick={handleDecrement}
                            disabled={disabled || (min !== undefined && value <= min)}
                        >
                            <RemoveIcon />
                        </IconButton>
                        <IconButton
                            onClick={handleIncrement}
                            disabled={disabled || (max !== undefined && value >= max)}
                        >
                            <AddIcon />
                        </IconButton>
                    </InputAdornment>
                ),
            }}
        />
    );
}
