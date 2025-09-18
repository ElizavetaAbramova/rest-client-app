import { EmptyHistoryProps } from '../../types/EmptyHistoryProps';

function EmptyHistory({
  onClickNavigator,
  header,
  text,
  clickLabel,
  varLabel,
}: EmptyHistoryProps) {
  return (
    <div className="m-auto flex w-full flex-col items-center justify-center gap-5 self-center p-3 md:w-1/2 md:pt-[150px] md:pb-[150px]">
      <p className="text-center text-4xl">{header}</p>
      <p className="max-w-[550px] text-center">{text}</p>
      <div className="w-full text-center md:w-1/2">
        <button
          onClick={() => {
            onClickNavigator('/client');
          }}
          className="btn btn-soft btn-primary m-1 w-1/3 rounded-sm"
        >
          {clickLabel}
        </button>
        <button
          onClick={() => {
            onClickNavigator('/variables');
          }}
          className="btn btn-soft btn-primary m-1 w-1/3 rounded-sm"
        >
          {varLabel}
        </button>
      </div>
    </div>
  );
}

export default EmptyHistory;
