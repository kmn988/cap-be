export enum SellStatus {
  AVAILABLE = 'AVAILABLE',
  SOLD = 'SOLD',
  NOT_AVAILABLE = 'NOT_AVAILABLE',
}

export enum PlantingType {
  FIRST_CROP = 'FIRST_CROP',
  SECOND_CROP = 'SECOND_CROP',
}

export const sellStatusMapping: { [key: string]: SellStatus } = {
  'Sẵn sàng': SellStatus.AVAILABLE,
  'Đã bán': SellStatus.SOLD,
  'Chưa sẵn sàng': SellStatus.NOT_AVAILABLE,
};

export const plantingTypeMapping: { [key: string]: PlantingType } = {
  'Chính vụ': PlantingType.FIRST_CROP,
  'Rải vụ': PlantingType.SECOND_CROP,
  // Add more mappings as needed
};
