export default function joinClasses(...args: Array<boolean | null | string | undefined>) {
  return args.filter(Boolean).join(' ');
}
