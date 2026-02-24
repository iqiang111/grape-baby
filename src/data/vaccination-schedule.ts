// 中国国家免疫规划疫苗接种程序 (2024版)
export type VaccineScheduleItem = {
  name: string;
  dose: number;
  ageMonths: number;
  ageLabel: string;
};

export const vaccinationSchedule: VaccineScheduleItem[] = [
  { name: "乙肝疫苗", dose: 1, ageMonths: 0, ageLabel: "出生时" },
  { name: "卡介苗", dose: 1, ageMonths: 0, ageLabel: "出生时" },
  { name: "乙肝疫苗", dose: 2, ageMonths: 1, ageLabel: "1月龄" },
  { name: "脊灰灭活疫苗", dose: 1, ageMonths: 2, ageLabel: "2月龄" },
  { name: "脊灰灭活疫苗", dose: 2, ageMonths: 3, ageLabel: "3月龄" },
  { name: "百白破疫苗", dose: 1, ageMonths: 3, ageLabel: "3月龄" },
  { name: "脊灰减毒活疫苗", dose: 3, ageMonths: 4, ageLabel: "4月龄" },
  { name: "百白破疫苗", dose: 2, ageMonths: 4, ageLabel: "4月龄" },
  { name: "百白破疫苗", dose: 3, ageMonths: 5, ageLabel: "5月龄" },
  { name: "乙肝疫苗", dose: 3, ageMonths: 6, ageLabel: "6月龄" },
  { name: "A群流脑多糖疫苗", dose: 1, ageMonths: 6, ageLabel: "6月龄" },
  { name: "麻腮风疫苗", dose: 1, ageMonths: 8, ageLabel: "8月龄" },
  { name: "乙脑减毒活疫苗", dose: 1, ageMonths: 8, ageLabel: "8月龄" },
  { name: "A群流脑多糖疫苗", dose: 2, ageMonths: 9, ageLabel: "9月龄" },
  { name: "麻腮风疫苗", dose: 2, ageMonths: 18, ageLabel: "18月龄" },
  { name: "甲肝减毒活疫苗", dose: 1, ageMonths: 18, ageLabel: "18月龄" },
  { name: "百白破疫苗", dose: 4, ageMonths: 18, ageLabel: "18月龄" },
  { name: "脊灰减毒活疫苗", dose: 4, ageMonths: 48, ageLabel: "4岁" },
  { name: "A群C群流脑多糖疫苗", dose: 1, ageMonths: 36, ageLabel: "3岁" },
  { name: "A群C群流脑多糖疫苗", dose: 2, ageMonths: 72, ageLabel: "6岁" },
  { name: "乙脑减毒活疫苗", dose: 2, ageMonths: 24, ageLabel: "2岁" },
  { name: "白破疫苗", dose: 1, ageMonths: 72, ageLabel: "6岁" },
];
