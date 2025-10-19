import React from 'react';
import { Upload } from 'lucide-react';

const EmptyState: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-full bg-gray-50">
      <div className="text-center">
        <Upload size={64} className="mx-auto mb-4 text-gray-400" />
        <p className="text-xl text-gray-600 mb-2">SQLファイルをアップロードしてください</p>
        <p className="text-sm text-gray-500">CREATE TABLE文を含む.sqlファイルに対応しています</p>
      </div>
    </div>
  );
};

export default EmptyState;
