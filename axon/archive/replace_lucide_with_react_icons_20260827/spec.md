# Specification: Replace Lucide React with React Icons Dependency Migration

## Overview
Migrate the KopaWee+ icon system across all shared components, landing sections, auth/onboarding pages, and dashboard sub-modules from `lucide-react` to `react-icons`.

This refactor aligns with project technical guidelines by updating `axon/tech-stack.md` to specify `react-icons` as the official icon package.

## Key Requirements

### 1. Package Dependency Update
- Uninstall `lucide-react` (`pnpm remove lucide-react`).
- Install `react-icons` (`pnpm add react-icons`).

### 2. Icon Subpackage Mapping
Map Lucide React icon usages to equivalent icons from `react-icons/fi` (Feather), `react-icons/hi2` (Heroicons), `react-icons/tb` (Tabler), `react-icons/fa6` (FontAwesome), or `react-icons/lu` (Lucide subpackage in react-icons):
- `ArrowRight` ➔ `FiArrowRight` or `HiArrowRight`
- `CheckCircle2` / `CheckSquare` ➔ `FiCheckCircle` / `FiCheckSquare`
- `MapPin` ➔ `FiMapPin` or `HiMapPin`
- `Search` ➔ `FiSearch`
- `User` / `Users` ➔ `FiUser` / `FiUsers`
- `ShieldCheck` / `ShieldAlert` ➔ `FiShield` / `HiShieldCheck`
- `Plus` / `X` ➔ `FiPlus` / `FiX`
- `MessageSquare` ➔ `FiMessageSquare`
- `Home` ➔ `FiHome`
- `AlertTriangle` / `AlertCircle` ➔ `FiAlertTriangle` / `FiAlertCircle`
- `Sparkles` ➔ `HiSparkles` or `FiZap`

### 3. Tech Stack Synchronization
- Update `axon/tech-stack.md` to list `react-icons` under Icons & Asset Libraries.
