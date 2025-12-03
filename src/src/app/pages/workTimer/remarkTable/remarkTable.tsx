import type { RemarksTableProps } from "@interfaces/IWorkTimer";
import { formatDateAll } from "../../../functions/index";
import { Tooltip } from 'react-tooltip';

const RemarksTable: React.FC<RemarksTableProps> = ({ remarks }) => {
  if (remarks.length === 0) {
    return (
      <div className="text-center p-6 bg-gray-800 rounded-lg shadow-xl">
        <p className="text-gray-300 ">Nenhuma observação registrada.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-2xl border border-gray-700/50 w-full overflow-hidden ">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-700">
          <tr>
            <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-200 tracking-wider w-1/3">
              Descrição
            </th>
            <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-200 tracking-wider hidden sm:table-cell w-1/3">
              Horas
            </th>
            <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-200 tracking-wider w-1/3">
              Atualizado em
            </th>
            <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-200 tracking-wider w-1/3">
              Atualizado por
            </th>            
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-800">
          {remarks.map((remark, index) => (
            <tr key={index} className="hover:bg-gray-700 transition duration-150">
              <td
                className="px-2 py-4 text-sm text-center text-gray-300 max-w-xs truncate"
                {...(remark.description.length > 25 && {
                  'data-tooltip-id': 'remark-tooltip',
                  'data-tooltip-content': remark.description
                })}
              >
                {remark.description}
              </td>
              <td className="px-6 py-4 text-center whitespace-nowrap text-sm font-medium text-blue-300 hidden sm:table-cell">
                {remark.value}
              </td>
              <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-400">
                {formatDateAll(remark.updateAt.toString())}
              </td>
              <td className="px-6 py-4 text-center whitespace-nowrap text-sm font-medium text-blue-300 hidden sm:table-cell">
                {remark.userName}
              </td>              
            </tr>
          ))}
        </tbody>
      </table>

      <Tooltip
        id="remark-tooltip"
        className="!bg-gray-900 !text-gray-100 !rounded-lg !px-3 !py-2 !text-sm !max-w-md !z-50 !border !border-gray-700 !shadow-xl"
        style={{
          maxWidth: '400px',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word'
        }}
        place="top"
        offset={10}
        delayShow={500}
      />
    </div>
  );
};

export default RemarksTable;