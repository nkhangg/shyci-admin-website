import type { Icon } from '@phosphor-icons/react/dist/lib/types';
import { ChartPie as ChartPieIcon } from '@phosphor-icons/react/dist/ssr/ChartPie';
import { GearSix as GearSixIcon } from '@phosphor-icons/react/dist/ssr/GearSix';
import { CoatHanger, Hoodie, Images, Package } from '@phosphor-icons/react/dist/ssr';
import { PlugsConnected as PlugsConnectedIcon } from '@phosphor-icons/react/dist/ssr/PlugsConnected';
import { User as UserIcon } from '@phosphor-icons/react/dist/ssr/User';
import { Users as UsersIcon } from '@phosphor-icons/react/dist/ssr/Users';
import { XSquare } from '@phosphor-icons/react/dist/ssr/XSquare';
export const navIcons = {
    'chart-pie': ChartPieIcon,
    'gear-six': GearSixIcon,
    products: Hoodie,
    orders: Package,
    categories: CoatHanger,
    'plugs-connected': PlugsConnectedIcon,
    'x-square': XSquare,
    'collection-home': Images,
    user: UserIcon,
    users: UsersIcon,
} as Record<string, Icon>;
