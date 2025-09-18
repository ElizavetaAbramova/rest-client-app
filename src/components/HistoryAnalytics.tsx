import { HistoryAnalyticsProps } from '../../types/HistoryAnalyticsProps';

function HistoryAnalytics({
  history,
  tableHeaders,
  onClickNavigator,
}: HistoryAnalyticsProps) {
  return (
    <div className="rounded-box border-base-content/5 bg-base-100 w-full overflow-x-auto border">
      <table className="table">
        <thead>
          <tr className="bg-base-700">
            {tableHeaders.map((header, i) => {
              return (
                <th key={i} className="w-50 px-4 py-2 text-center">
                  {header}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {history.map((responseData) => {
            return (
              <tr
                key={responseData.id}
                className="table-row cursor-pointer hover:bg-gray-800"
                onClick={() => {
                  onClickNavigator(`/client#${responseData.url}`);
                }}
              >
                <td className="px-4 py-2 text-center">
                  {responseData.created_at.toString()}
                </td>
                <td className="px-4 py-2 text-center">{responseData.method}</td>
                <td className="px-4 py-2 text-center">
                  {responseData.api_url}
                </td>
                <td className="px-4 py-2 text-center">
                  {responseData.status_code}
                </td>
                <td className="px-4 py-2 text-center">
                  {responseData.duration_ms}
                </td>
                <td className="px-4 py-2 text-center">
                  {responseData.response_size}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default HistoryAnalytics;
