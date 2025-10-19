import { useCallback } from 'react';
import { parseSQLToTables } from '../utils/sqlParser';
import { Table, Relationship } from '../types';
import { ERROR_MESSAGES } from '../constants/diagram';

interface UseFileUploadReturn {
  handleFileUpload: (
    event: React.ChangeEvent<HTMLInputElement>,
    onSuccess: (tables: Table[], relationships: Relationship[], content: string) => void
  ) => void;
}

export const useFileUpload = (): UseFileUploadReturn => {
  const handleFileUpload = useCallback(
    (
      event: React.ChangeEvent<HTMLInputElement>,
      onSuccess: (tables: Table[], relationships: Relationship[], content: string) => void
    ) => {
      const files = event.target.files;
      const target = event.target;

      if (!files || files.length === 0) return;

      const fileContents: string[] = [];
      let filesProcessed = 0;

      // 複数ファイルを読み込む
      Array.from(files).forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          fileContents[index] = content;
          filesProcessed++;

          // 全ファイルの読み込みが完了したらパース
          if (filesProcessed === files.length) {
            const combinedContent = fileContents.join('\n\n');

            try {
              const { tables: parsedTables, relationships: parsedRelationships } =
                parseSQLToTables(combinedContent);
              onSuccess(parsedTables, parsedRelationships, combinedContent);
            } catch (error) {
              console.error('Failed to parse SQL:', error);
              alert(ERROR_MESSAGES.sqlParseFailed);
            }

            // inputをリセットして同じファイルを再度選択可能にする
            setTimeout(() => {
              target.value = '';
            }, 100);
          }
        };
        reader.onerror = (error) => {
          console.error('File reading error:', error);
          alert(ERROR_MESSAGES.fileUploadFailed);
        };
        reader.readAsText(file);
      });
    },
    []
  );

  return { handleFileUpload };
};
