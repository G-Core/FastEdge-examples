import useTemp from "@/hooks/useTemp";

interface TemperatureProps extends React.PropsWithChildren<unknown> {
  temperature: number;
}

const Temperature: React.FC<TemperatureProps> = ({ temperature }) => {
  const temp = useTemp(temperature);
  return <>{temp}</>;
};

export { Temperature };
