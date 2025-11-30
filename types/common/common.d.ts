interface ShipData {
    name: string;
    name_kr: string;
    rarity: number;
    equipment: Record<string, ShipEquipmentData>;
    base_reload: number;
    growth_reload: number;
    enhance_reload: number;
    retrofit?: {
        id: number;
        level: number;
        type?: number;
        bonus: Record<string, number>;
        skill: number;
        skin: number;
        armor: number;
    };
    type: number;
    hasSpecialWeapon?: number;
}

interface ShipEquipmentData {
    default: number;
    slot: number;
    type: number[];
    mount: number;
    preload: number;
    efficiency: number;
}

interface EquipmentData {
    id: number;
    rarity: number;
    type: number;
    reload?: number;
    reload_percent?: number;
    name_kr: string;
    name: string;
}
