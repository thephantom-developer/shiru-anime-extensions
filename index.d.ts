export type Speed = 'fast' | 'moderate' | 'slow'

export type Accuracy = 'high' | 'medium' | 'low'

export type ServerLocations =
  | 'AF' | 'AX' | 'AL' | 'DZ' | 'AS' | 'AD' | 'AO' | 'AI' | 'AQ' | 'AG' | 'AR' | 'AM' | 'AW' | 'AU' | 'AT' | 'AZ'
  | 'BS' | 'BH' | 'BD' | 'BB' | 'BY' | 'BE' | 'BZ' | 'BJ' | 'BM' | 'BT' | 'BO' | 'BQ' | 'BA' | 'BW' | 'BV' | 'BR'
  | 'IO' | 'BN' | 'BG' | 'BF' | 'BI' | 'KH' | 'CM' | 'CA' | 'CV' | 'KY' | 'CF' | 'TD' | 'CL' | 'CN' | 'CX' | 'CC'
  | 'CO' | 'KM' | 'CG' | 'CD' | 'CK' | 'CR' | 'CI' | 'HR' | 'CU' | 'CW' | 'CY' | 'CZ' | 'DK' | 'DJ' | 'DM' | 'DO'
  | 'EC' | 'EG' | 'SV' | 'GQ' | 'ER' | 'EE' | 'ET' | 'FK' | 'FO' | 'FJ' | 'FI' | 'FR' | 'GF' | 'PF' | 'TF' | 'GA'
  | 'GM' | 'GE' | 'DE' | 'GH' | 'GI' | 'GR' | 'GL' | 'GD' | 'GP' | 'GU' | 'GT' | 'GG' | 'GN' | 'GW' | 'GY' | 'HT'
  | 'HM' | 'VA' | 'HN' | 'HK' | 'HU' | 'IS' | 'IN' | 'ID' | 'IR' | 'IQ' | 'IE' | 'IM' | 'IL' | 'IT' | 'JM' | 'JP'
  | 'JE' | 'JO' | 'KZ' | 'KE' | 'KI' | 'KR' | 'KP' | 'KW' | 'KG' | 'LA' | 'LV' | 'LB' | 'LS' | 'LR' | 'LY' | 'LI'
  | 'LT' | 'LU' | 'MO' | 'MK' | 'MG' | 'MW' | 'MY' | 'MV' | 'ML' | 'MT' | 'MH' | 'MQ' | 'MR' | 'MU' | 'YT' | 'MX'
  | 'FM' | 'MD' | 'MC' | 'MN' | 'ME' | 'MS' | 'MA' | 'MZ' | 'MM' | 'NA' | 'NR' | 'NP' | 'NL' | 'NC' | 'NZ' | 'NI'
  | 'NE' | 'NG' | 'NU' | 'NF' | 'MP' | 'NO' | 'OM' | 'PK' | 'PW' | 'PS' | 'PA' | 'PG' | 'PY' | 'PE' | 'PH' | 'PN'
  | 'PL' | 'PT' | 'PR' | 'QA' | 'RE' | 'RO' | 'RU' | 'RW' | 'BL' | 'SH' | 'KN' | 'LC' | 'MF' | 'PM' | 'VC' | 'WS'
  | 'SM' | 'ST' | 'SA' | 'SN' | 'RS' | 'SC' | 'SL' | 'SG' | 'SX' | 'SK' | 'SI' | 'SB' | 'SO' | 'ZA' | 'GS' | 'SS'
  | 'ES' | 'LK' | 'SD' | 'SR' | 'SJ' | 'SZ' | 'SE' | 'CH' | 'SY' | 'TW' | 'TJ' | 'TZ' | 'TH' | 'TL' | 'TG' | 'TK'
  | 'TO' | 'TT' | 'TN' | 'TR' | 'TM' | 'TC' | 'TV' | 'UG' | 'UA' | 'AE' | 'GB' | 'US' | 'UM' | 'UY' | 'UZ' | 'VU'
  | 'VE' | 'VN' | 'VG' | 'VI' | 'WF' | 'EH' | 'YE' | 'ZM' | 'ZW';

export type RepositoryIndex = RepositoryConfig[]

export interface RepositoryConfig {
  /** Path to extension source. Supports 'gh:username/repo/path', 'npm:package-name', or direct URL. */
  main: string
}

export interface SourceConfig {
  id: string
  name: string
  version: string
  main: string
  update: string
  nsfw?: boolean
  unregulated?: boolean
  type?: 'torrent'
  speed?: Speed
  accuracy?: Accuracy
  regions?: ServerLocations[]
  settings?: SourceSetting[]
  deprecated?: boolean
  description?: string
  icon?: string
}

export type SourceSetting = TextSetting | ToggleSetting | DropdownSetting | MultiSelectSetting

interface BaseSourceSetting {
  key: string
  label: string
  description?: string
}

export interface TextSetting extends BaseSourceSetting {
  type: 'text'
  secret?: boolean
  default?: string
  required?: boolean
  placeholder?: string
}

export interface ToggleSetting extends BaseSourceSetting {
  type: 'toggle'
  default?: boolean
}

export interface DropdownSetting extends BaseSourceSetting {
  type: 'dropdown'
  options: DropdownOption[]
  default?: string
}

export interface MultiSelectSetting extends BaseSourceSetting {
  type: 'multiselect'
  options: DropdownOption[]
  default?: string[]
}

export interface DropdownOption {
  label: string
  value: string
}

export interface TorrentResult {
  title: string
  link: string
  id?: number | string
  seeders: number
  leechers: number
  downloads: number
  accuracy?: Accuracy
  hash: string
  size: number
  date: Date
  type?: 'batch' | 'best' | 'alt'
  sub_lang?: string[]
  audio_lang?: string[]
  dual_audio?: boolean
}

export interface TorrentQuery {
  anilistId?: number
  media?: any
  mappingsA?: any
  mappingsE?: any
  anidbAid?: number
  anidbEid?: number
  tvdbAid?: number
  tvdbEid?: number
  imdbAid?: string
  mvdbAid?: number
  titles: string[]
  episode?: number
  episodeCount?: number
  resolution?: '2160' | '1080' | '720' | '540' | '480' | ''
  exclusions?: string[]
}

export type SearchFunction = (query: TorrentQuery, options?: Record<string, any>) => Promise<TorrentResult[]>

export abstract class TorrentSource {
  single: SearchFunction
  batch: SearchFunction
  movie: SearchFunction
  validate: () => Promise<boolean>
}
