"use client"

import { useState, useRef } from "react"
import { Upload, Download, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function BatchFuelUpload() {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState(null)
  const fileInputRef = useRef(null)

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile)
      setResult(null)
    } else {
      alert("Por favor selecciona un archivo CSV válido")
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("/api/admin/fuel/batch", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()
      setResult(data)

      if (response.ok) {
        setFile(null)
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
      }
    } catch (error) {
      console.error("Error uploading file:", error)
      setResult({ success: false, message: "Error al subir el archivo" })
    } finally {
      setUploading(false)
    }
  }

  const downloadTemplate = () => {
    const csvContent = `station_id,fuel_type,quantity,start_time
1,Gasolina,5000,2024-01-15 14:30:00
2,Diesel,3000,2024-01-15 15:00:00`

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "plantilla_combustible.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Plantilla CSV</CardTitle>
          <CardDescription>Descarga la plantilla para ver el formato correcto del archivo CSV</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-medium mb-2">Formato requerido:</h4>
              <code className="text-sm">
                station_id,fuel_type,quantity,start_time
                <br />
                1,Gasolina,5000,2024-01-15 14:30:00
                <br />
                2,Diesel,3000,2024-01-15 15:00:00
              </code>
            </div>
            <Button onClick={downloadTemplate} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Descargar Plantilla
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Subir Archivo CSV</CardTitle>
          <CardDescription>Selecciona un archivo CSV con los registros de combustible</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <FileText className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">{file ? file.name : "Selecciona un archivo CSV"}</p>
                <input ref={fileInputRef} type="file" accept=".csv" onChange={handleFileSelect} className="hidden" />
                <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                  Seleccionar Archivo
                </Button>
              </div>
            </div>

            {file && (
              <Button onClick={handleUpload} disabled={uploading} className="w-full">
                <Upload className="mr-2 h-4 w-4" />
                {uploading ? "Subiendo..." : "Subir Archivo"}
              </Button>
            )}

            {result && (
              <Alert variant={result.success ? "default" : "destructive"}>
                <AlertDescription>
                  {result.message}
                  {result.processed && (
                    <div className="mt-2">
                      <p>Registros procesados: {result.processed}</p>
                      {result.errors?.length > 0 && (
                        <div className="mt-2">
                          <p className="font-medium">Errores:</p>
                          <ul className="list-disc list-inside text-sm">
                            {result.errors.map((error, index) => (
                              <li key={index}>{error}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
