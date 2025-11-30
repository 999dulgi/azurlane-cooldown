'use client';

import React, { useEffect, useMemo, useState } from 'react';
import ThemeRegistry from './ThemeRegistry';
import Image from 'next/image';
import {
    Box,
    Card,
    CardContent,
    Container,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    Typography,
    TextField,
    InputAdornment,
    IconButton,
    Tooltip,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Snackbar,
    Alert,
    Fab,
} from '@mui/material';
import { SxProps, Theme, SelectChangeEvent } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import HelpIcon from '@mui/icons-material/Help';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

interface ShipInfoType {
    ship: ShipData | undefined;
    equipment1: EquipmentData | undefined;
    equipment2: EquipmentData | undefined;
    equipment3: EquipmentData | undefined;
    equipment4: EquipmentData | undefined;
    affinity: number;
    level: number;
    number: number;
    isSupportShip: boolean;
}

export default function Home() {
    const [ships, setShips] = useState<ShipData[]>([]);
    const [equipments, setEquipments] = useState<EquipmentData[]>([]);
    const [CVreload, setCVreload] = useState<number>(42);
    const [CVLreload, setCVLreload] = useState<number>(45);
    const [commander, setCommander] = useState<boolean>(false);
    const [commanderReload, setCommanderReload] = useState<number>(0);
    const [supporter, setSupporter] = useState<boolean>(false);

    const initialShipInfo: ShipInfoType = useMemo(
        () => ({
            ship: undefined,
            equipment1: undefined,
            equipment2: undefined,
            equipment3: undefined,
            equipment4: undefined,
            affinity: 6,
            level: 125,
            number: 0,
            isSupportShip: false,
        }),
        []
    );

    const [shipInfo1, setShipInfo1] = useState<ShipInfoType>(initialShipInfo);
    const [shipInfo2, setShipInfo2] = useState<ShipInfoType>(initialShipInfo);
    const [shipInfo3, setShipInfo3] = useState<ShipInfoType>(initialShipInfo);

    const [helpDialogOpen, setHelpDialogOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(true);

    const reset = () => {
        setCVreload(42);
        setCVLreload(45);
        setCommander(false);
        setCommanderReload(0);
        setSupporter(false);
        setShipInfo1(initialShipInfo);
        setShipInfo2(initialShipInfo);
        setShipInfo3(initialShipInfo);
    };

    const finalResult = useMemo(() => {
        const allResults = [shipInfo1, shipInfo2, shipInfo3];

        if (allResults.map((r) => r.number).filter((r) => r > 0).length !== 3) {
            return '-';
        }

        const sortedShips = [...allResults].sort((a, b) => a.number - b.number);
        const supportShips = allResults.filter((r) => r.isSupportShip);

        if (supportShips.length > 0) {
            const secondLargest = sortedShips[1];

            const isAnySupportShipSecondLargest = supportShips.some((ship) => ship.number === secondLargest.number);

            if (!isAnySupportShipSecondLargest) {
                return 'X';
            }
        }

        const diff12 = sortedShips[2].number - sortedShips[1].number;
        const diff23 = sortedShips[1].number - sortedShips[0].number;

        const isConditionMet = (d: number) => d >= 0.033 && d <= 0.28;

        if (isConditionMet(diff12) && isConditionMet(diff23)) {
            return 'O';
        } else {
            return 'X';
        }
    }, [shipInfo1, shipInfo2, shipInfo3]);

    // Save state to localStorage whenever it changes
    useEffect(() => {
        // Do not save initial empty state
        if (ships.length === 0 || equipments.length === 0) return;

        const stateToSave = {
            shipInfo1,
            shipInfo2,
            shipInfo3,
            CVreload,
            CVLreload,
            commander,
            commanderReload,
            supporter,
        };
        localStorage.setItem('azurlane-cooldown-state', JSON.stringify(stateToSave));
    }, [
        shipInfo1,
        shipInfo2,
        shipInfo3,
        CVreload,
        CVLreload,
        commander,
        commanderReload,
        supporter,
        ships,
        equipments,
    ]);

    useEffect(() => {
        const fetchJSON = async () => {
            try {
                const responseShip = await fetch('ships.json');
                const responseEquip = await fetch('equipments.json');

                const shipData = await responseShip.json();
                const equipData = await responseEquip.json();

                setShips(shipData);
                setEquipments(equipData);

                // Load state from localStorage
                const savedStateJSON = localStorage.getItem('azurlane-cooldown-state');
                if (savedStateJSON) {
                    const savedState = JSON.parse(savedStateJSON);

                    const rehydrateShipInfo = (savedShipInfo: ShipInfoType): ShipInfoType => {
                        if (!savedShipInfo.ship) return initialShipInfo;
                        return {
                            ...savedShipInfo,
                            ship: shipData.find((s: ShipData) => s.name === savedShipInfo.ship?.name),
                            equipment1: equipData.find((e: EquipmentData) => e.id === savedShipInfo.equipment1?.id),
                            equipment2: equipData.find((e: EquipmentData) => e.id === savedShipInfo.equipment2?.id),
                            equipment3: equipData.find((e: EquipmentData) => e.id === savedShipInfo.equipment3?.id),
                            equipment4: equipData.find((e: EquipmentData) => e.id === savedShipInfo.equipment4?.id),
                        };
                    };

                    setShipInfo1(rehydrateShipInfo(savedState.shipInfo1));
                    setShipInfo2(rehydrateShipInfo(savedState.shipInfo2));
                    setShipInfo3(rehydrateShipInfo(savedState.shipInfo3));

                    if (savedState.CVreload) setCVreload(savedState.CVreload);
                    if (savedState.CVLreload) setCVLreload(savedState.CVLreload);
                    if (savedState.commander) setCommander(savedState.commander);
                    if (savedState.commanderReload) setCommanderReload(savedState.commanderReload);
                    if (savedState.supporter) setSupporter(savedState.supporter);
                }
            } catch (error) {
                console.error('Error fetching ships:', error);
            }
        };

        fetchJSON();
    }, [initialShipInfo]);

    return (
        <ThemeRegistry darkMode={darkMode}>
            <Container
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    py: 4,
                }}
                maxWidth="xl"
            >
                <Typography variant="h2" color="primary" sx={{ fontWeight: 'bold', mb: 2 }}>
                    함대 공습 쿨타임 계산기
                </Typography>
                <Dialog open={helpDialogOpen} onClose={() => setHelpDialogOpen(false)} scroll="paper">
                    <DialogContent>
                        <Stack spacing={1} sx={{ lineHeight: 1.7 }}>
                            <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                                사용 방법
                            </Typography>
                            <Typography color="text.secondary">
                                각 함선의 공습 쿨타임이 계산된 후, 세 항모의 쿨타임 간격이 각각 0.03초 이상 0.28초
                                이하여야 합니다. 만약 이 조건을 만족하면 최종 결과에 &apos;O&apos;가 표시됩니다.
                                <br />
                                <br />
                                만약 정지 항모(아우구스트 폰 파르제팔, 임플레커블, 어드미랄 나히모프)가 포함된 경우,
                                정지 항모의 공습 순서가 2번째여야만 합니다. 이 조건이 맞지 않으면 최종 결과에
                                &apos;X&apos;가 표시됩니다.
                            </Typography>
                            <Typography variant="h6" color="primary" sx={{ mt: 3, fontWeight: 'bold' }}>
                                하늘의 서포터
                            </Typography>
                            <Typography color="text.secondary">
                                &apos;하늘의 서포터&apos; 스킬(카사블랑카, 인디펜던스 등)은 다른 함대에 편성된 항모의
                                장전 스탯을 4% 올려주는 효과를 가집니다. 이 옵션을 활성화하면 해당 버프가 계산에
                                포함됩니다.
                            </Typography>
                            <Typography variant="h6" color="primary" sx={{ mt: 3, fontWeight: 'bold' }}>
                                내보내기
                            </Typography>
                            <Typography color="text.secondary">
                                &apos;내보내기&apos; 버튼을 통해 현재 함선에 장착된 장비 구성을 코드로 복사할 수
                                있습니다. 이 코드는 인게임 도크의 &apos;장비 코드&apos; 기능을 통해 붙여넣어 사용할 수
                                있습니다.
                            </Typography>
                        </Stack>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setHelpDialogOpen(false)}>닫기</Button>
                    </DialogActions>
                </Dialog>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        gap: 2,
                        justifyContent: 'center',
                    }}
                >
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <SelectInfo
                            slot={1}
                            ships={ships}
                            equipments={equipments}
                            shipInfo={shipInfo1}
                            setShipInfo={setShipInfo1}
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
                            shipInfo={shipInfo2}
                            setShipInfo={setShipInfo2}
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
                            shipInfo={shipInfo3}
                            setShipInfo={setShipInfo3}
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
                                            onChange={(e) => {
                                                setCommander(e.target.value ? true : false);
                                                setCommanderReload(0);
                                            }}
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
                                        src={`image/hammann/hammann${finalResult}.png`}
                                        alt="hammannResult"
                                        width={512}
                                        height={512}
                                        style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
                                    />
                                </Box>
                            </CardContent>
                        </Card>
                        <Button variant="contained" onClick={() => reset()} startIcon={<RestartAltIcon />} fullWidth>
                            초기화
                        </Button>
                    </Box>
                </Box>
                <Box
                    sx={{ position: 'fixed', bottom: 16, right: 16, display: 'flex', flexDirection: 'column', gap: 2 }}
                >
                    <Fab color="primary" aria-label="help" onClick={() => setHelpDialogOpen(true)}>
                        <HelpIcon />
                    </Fab>
                    <Fab color="primary" aria-label="toggle-theme" onClick={() => setDarkMode(!darkMode)}>
                        {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
                    </Fab>
                </Box>
            </Container>
        </ThemeRegistry>
    );
}

function SelectInfo({
    slot,
    ships,
    equipments,
    shipInfo,
    setShipInfo,
    CVReload,
    CVLReload,
    commander,
    commanderReload,
    supporter,
}: {
    slot: number;
    ships: ShipData[];
    equipments: EquipmentData[];
    shipInfo: ShipInfoType;
    setShipInfo: React.Dispatch<React.SetStateAction<ShipInfoType>>;
    CVReload: number;
    CVLReload: number;
    commander: boolean;
    commanderReload: number;
    supporter: boolean;
}) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [exportLevel, setExportLevel] = useState<number>(13);
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const calculatedResult = useMemo(() => {
        const { ship, equipment1, equipment2, equipment3, equipment4, affinity, level } = shipInfo;

        if (!ship || !equipment1 || !equipment2 || !equipment3 || !equipment4) {
            return { number: 0, isSupportShip: false };
        }

        const statReload = Math.floor(
            (ship.base_reload + (ship.growth_reload * (level - 1)) / 1000 + (ship.enhance_reload || 0)) *
                (1 + affinity / 100) +
                (ship.retrofit?.bonus?.reload || 0)
        );

        let shipReload = statReload + (commander ? commanderReload : 0) + (ship.type === 7 ? CVReload : CVLReload);
        let isSupportShip = false;

        if (ship?.name === 'Implacable') {
            if (equipment3.type === 9) {
                shipReload = shipReload * (1.1 + (supporter ? 0.04 : 0));
            }
            isSupportShip = true;
        } else if (ship?.name === 'August von Parseval') {
            if (
                equipment1.id === 47140 ||
                equipment1.id === 47160 ||
                equipment1.id === 47180 ||
                equipment1.id === 47200 ||
                equipment3.id === 48040
            ) {
                shipReload = shipReload * (1.12 + (supporter ? 0.04 : 0));
            }
            isSupportShip = true;
        } else {
            shipReload = shipReload * (1 + (supporter ? 0.04 : 0));
            if (ship?.name === 'Admiral Nakhimov') {
                isSupportShip = true;
            }
        }

        if (ship.hasSpecialWeapon) {
            shipReload += ship.hasSpecialWeapon;
        }

        shipReload = Math.floor(shipReload);

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
        return { number: Number(finalCooldown.toFixed(2)), isSupportShip };
    }, [shipInfo, commander, commanderReload, CVReload, CVLReload, supporter]);

    useEffect(() => {
        if (calculatedResult.number !== shipInfo.number || calculatedResult.isSupportShip !== shipInfo.isSupportShip) {
            setShipInfo((prev) => ({ ...prev, ...calculatedResult }));
        }
    }, [calculatedResult, shipInfo.number, shipInfo.isSupportShip, setShipInfo]);

    const handleShipChange = (event: SelectChangeEvent) => {
        const selectedShip = ships.find((ship) => ship.name === event.target.value);
        setShipInfo((prev) => ({
            ...prev,
            ship: selectedShip,
            equipment1: undefined,
            equipment2: undefined,
            equipment3: undefined,
            equipment4: equipments.find((eq) => eq.id === 1440),
        }));
    };

    const handleExportButtonClick = () => {
        const equipmentText = (equipment: EquipmentData) => {
            if (equipment.rarity <= 4) {
                return (equipment.id + (exportLevel <= 11 ? exportLevel : 11)).toString(32);
            } else {
                return (equipment.id + exportLevel).toString(32);
            }
        };

        let text = '';

        if (shipInfo.equipment1) {
            text += equipmentText(shipInfo.equipment1) + '/';
        } else {
            text += '0/';
        }
        if (shipInfo.equipment2) {
            text += equipmentText(shipInfo.equipment2) + '/';
        } else {
            text += '0/';
        }
        if (shipInfo.equipment3) {
            text += equipmentText(shipInfo.equipment3) + '/';
        } else {
            text += '0/';
        }
        if (shipInfo.equipment4) {
            text += equipmentText(shipInfo.equipment4) + '/';
        } else {
            text += '0/';
        }
        text += (1440 + exportLevel).toString(32) + '\\0';

        navigator.clipboard.writeText(btoa(text.toUpperCase())).then(() => {
            setSnackbarOpen(true);
            setDialogOpen(false);
        });
    };

    const setEquipment = (equipment: EquipmentData | undefined, slotIndex: number) => {
        setShipInfo((prev) => ({
            ...prev,
            [`equipment${slotIndex}`]: equipment,
        }));
    };

    const renderEquipmentSlot = (
        label: string,
        setter: (equipment: EquipmentData | undefined, slotIndex: number) => void,
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
            <Stack spacing={1} alignItems="center">
                <FormControl sx={{ width: 160 }} disabled={isDisabled}>
                    <InputLabel id={`${label}-label`}>{label}</InputLabel>
                    <Select
                        labelId={`${label}-label`}
                        id={label}
                        value={value?.name || ''}
                        label={label}
                        onChange={(e) =>
                            setter(
                                equipments.find((eq) => eq.name === e.target.value),
                                slotIndex
                            )
                        }
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
                    src={value ? `image/equipments/${value.id}.png` : 'image/placeholder/placeholder_equip.png'}
                    alt="placeholder"
                    sx={{
                        width: 160,
                        height: 160,
                        borderRadius: 1,
                        objectFit: value ? 'scale-down' : 'contain',
                        backgroundSize: 'cover',
                        backgroundImage: `url(${value ? `image/rarity/rarity_bg_${value.rarity}.png` : 'image/rarity/rarity_bg_5.png'})`,
                    }}
                />
                <Typography variant="body1" sx={{ textAlign: 'center' }}>
                    {equipmentText}
                </Typography>
            </Stack>
        );
    };

    return (
        <>
            <Card>
                <CardContent>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
                        <Stack spacing={1} alignItems="center">
                            <FormControl sx={{ width: 160 }}>
                                <InputLabel id="ship-label">Ship</InputLabel>
                                <Select
                                    labelId="ship-label"
                                    id="ship"
                                    value={shipInfo.ship?.name || ''}
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
                                    shipInfo.ship
                                        ? `image/ships/${shipInfo.ship.name}.png`
                                        : `image/placeholder/placeholder_ship${slot}.png`
                                }
                                alt="placeholder"
                                sx={{
                                    width: 160,
                                    height: 160,
                                    borderRadius: 1,
                                    backgroundSize: 'cover',
                                    backgroundImage: `url(${shipInfo.ship ? (shipInfo.ship.retrofit ? `image/rarity/rarity_bg_${shipInfo.ship.rarity + 1}.png` : `image/rarity/rarity_bg_${shipInfo.ship.rarity}.png`) : ''})`,
                                }}
                            />
                            <Box
                                sx={{
                                    height: '1.5rem',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                {(() => {
                                    if (!shipInfo.ship) {
                                        return <Typography variant="body1">&nbsp;</Typography>;
                                    }

                                    let tooltipTitle = '';
                                    const sxProps: SxProps<Theme> = { textAlign: 'center' };

                                    if (shipInfo.ship.name === 'August von Parseval') {
                                        tooltipTitle = '함재기 장비시 장전 12% 증가';
                                        sxProps.fontSize = '0.9rem';
                                        sxProps.textDecoration = 'underline';
                                    } else if (shipInfo.ship.name === 'Implacable') {
                                        tooltipTitle = '폭격기 장비시 장전 10% 증가';
                                        sxProps.textDecoration = 'underline';
                                    } else if (shipInfo.ship.name.length > 12) {
                                        sxProps.fontSize = '0.9rem';
                                    } else if (shipInfo.ship.hasSpecialWeapon) {
                                        tooltipTitle = '전용장비 장전 +' + shipInfo.ship.hasSpecialWeapon;
                                        sxProps.textDecoration = 'underline';
                                    }

                                    return (
                                        <Tooltip title={tooltipTitle}>
                                            <Typography variant="body1" sx={sxProps}>
                                                {shipInfo.ship.name_kr}
                                            </Typography>
                                        </Tooltip>
                                    );
                                })()}
                            </Box>
                        </Stack>

                        <Box
                            sx={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 2,
                                justifyContent: 'center',
                            }}
                        >
                            {renderEquipmentSlot('Equipment 1', setEquipment, shipInfo.equipment1, shipInfo.ship, 1)}
                            {renderEquipmentSlot('Equipment 2', setEquipment, shipInfo.equipment2, shipInfo.ship, 2)}
                            {renderEquipmentSlot('Equipment 3', setEquipment, shipInfo.equipment3, shipInfo.ship, 3)}
                            {renderEquipmentSlot('Equipment 4', setEquipment, shipInfo.equipment4, shipInfo.ship, 4)}
                        </Box>

                        <Stack spacing={1} alignSelf={{ xs: 'center', md: 'flex-start' }}>
                            <FormControl sx={{ width: 160 }}>
                                <InputLabel id="level-label">레벨</InputLabel>
                                <Select
                                    labelId="level-label"
                                    id="level"
                                    value={shipInfo.level}
                                    label="레벨"
                                    onChange={(e) =>
                                        setShipInfo((prev) => ({ ...prev, level: e.target.value as number }))
                                    }
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
                                    value={shipInfo.affinity}
                                    label="호감도"
                                    onChange={(e) =>
                                        setShipInfo((prev) => ({ ...prev, affinity: e.target.value as number }))
                                    }
                                >
                                    <MenuItem value={1}>50 (1%)</MenuItem>
                                    <MenuItem value={3}>90 (3%)</MenuItem>
                                    <MenuItem value={6}>100 (6%)</MenuItem>
                                    <MenuItem value={9}>150 (9%)</MenuItem>
                                    <MenuItem value={12}>200 (12%)</MenuItem>
                                </Select>
                            </FormControl>
                            <Stack spacing={0}>
                                <Typography variant="body1" sx={{ textAlign: 'center' }}>
                                    공습 쿨타임
                                </Typography>
                                <Typography variant="h6" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                                    {shipInfo.number}
                                </Typography>
                            </Stack>
                            <Button variant="contained" onClick={() => setDialogOpen(true)}>
                                내보내기
                            </Button>
                        </Stack>
                    </Stack>
                </CardContent>
            </Card>
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogTitle>내보내기</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ pt: 1 }}>
                        <TextFieldNumber
                            id="export-level"
                            label="강화 레벨"
                            value={exportLevel}
                            setValue={setExportLevel}
                            min={0}
                            max={13}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>취소</Button>
                    <Button onClick={handleExportButtonClick} variant="contained">
                        내보내기
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
                    클립보드에 복사되었습니다.
                </Alert>
            </Snackbar>
        </>
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
