import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { CSVLink } from 'react-csv';

function Index() {
  const [csvData, setCsvData] = useState([]);
  const [fileName, setFileName] = useState('edited_data.csv');

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        const rows = text.split('\n').map((row) => row.split(','));
        setCsvData(rows);
      };
      reader.readAsText(file);
    }
  };

  const handleAddRow = () => {
    setCsvData([...csvData, Array(csvData[0].length).fill('')]);
  };

  const handleRemoveRow = (index) => {
    setCsvData(csvData.filter((_, i) => i !== index));
  };

  const handleCellChange = (rowIndex, cellIndex, value) => {
    const newData = [...csvData];
    newData[rowIndex][cellIndex] = value;
    setCsvData(newData);
  };

  const handleDownload = () => {
    toast('CSV file downloaded successfully!');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl text-center mb-4">CSV Upload, Edit, and Download Tool</h1>
      <div className="mb-4">
        <Input type="file" accept=".csv" onChange={handleFileUpload} />
      </div>
      {csvData.length > 0 && (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                {csvData[0].map((_, cellIndex) => (
                  <TableHead key={cellIndex}>Column {cellIndex + 1}</TableHead>
                ))}
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {csvData.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <TableCell key={cellIndex}>
                      <Input
                        value={cell}
                        onChange={(e) => handleCellChange(rowIndex, cellIndex, e.target.value)}
                      />
                    </TableCell>
                  ))}
                  <TableCell>
                    <Button variant="destructive" onClick={() => handleRemoveRow(rowIndex)}>
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-4 flex space-x-2">
            <Button onClick={handleAddRow}>Add Row</Button>
            <CSVLink data={csvData} filename={fileName}>
              <Button onClick={handleDownload}>Download CSV</Button>
            </CSVLink>
          </div>
        </>
      )}
    </div>
  );
}

export default Index;