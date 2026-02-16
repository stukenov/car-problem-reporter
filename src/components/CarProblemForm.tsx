"use client"

import React from "react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { 
  Car, Camera, Eye, EyeOff, ChevronRight, HelpCircle,
  Paintbrush2, Wrench, Droplets, Fuel, ChevronLeft,
  MapPin, Sparkles, Loader2, Check, X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

const formSchema = z.object({
  city: z.string({
    required_error: "Пожалуйста, выберите город",
  }),
  problem: z.string().min(10, { message: "Опишите проблему подробнее (минимум 10 символов)" }),
  section: z.string().optional()
})

type FormValues = z.infer<typeof formSchema>

const sections = [
  {
    id: 'bodywork',
    title: 'Кузовные работы и детейлинг',
    icon: Paintbrush2,
    subsections: [
      'Покраска', 'Полировка', 'Рихтовка', 'Замена деталей',
      'Химчистка', 'Защитные покрытия', 'Тонировка', 'Антикор'
    ]
  },
  {
    id: 'service',
    title: 'СТО',
    icon: Wrench,
    subsections: [
      'Диагностика', 'Ремонт двигателя', 'Ремонт подвески',
      'Ремонт тормозов', 'Ремонт КПП', 'Электрика'
    ]
  },
  {
    id: 'fluids',
    title: 'Замена масла и жидкостей',
    icon: Droplets,
    subsections: [
      'Моторное масло', 'Трансмиссионное масло', 'Тормозная жидкость',
      'Антифриз', 'Жидкость ГУР', 'Комплексная замена'
    ]
  },
  {
    id: 'gas',
    title: 'Установка газа на авто',
    icon: Fuel,
    subsections: [
      'Установка ГБО', 'Настройка ГБО', 'Ремонт ГБО',
      'Диагностика ГБО', 'Регистрация ГБО'
    ]
  }
]

interface AiResponse {
  sectionId: string;
  subsection: string;
  explanation?: string;
}

const CarProblemForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSections, setShowSections] = useState(false)
  const [hideNumber, setHideNumber] = useState(false)
  const [selectedSection, setSelectedSection] = useState<string | null>(null)
  const [isAiSelecting, setIsAiSelecting] = useState(false)
  const [selectedSubsection, setSelectedSubsection] = useState<string | null>(null)
  const [aiSuggestion, setAiSuggestion] = useState<{ sectionId: string, subsection: string } | null>(null)
  const [selectedSectionInfo, setSelectedSectionInfo] = useState<{ title: string, subsection: string } | null>(null)
  const [selectedCity, setSelectedCity] = useState("Алматы")
  const [aiError, setAiError] = useState<string | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      problem: "",
      city: "almaty",
      section: ""
    },
  })

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true)
    try {
      console.log(values)
      await new Promise(resolve => setTimeout(resolve, 500))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSectionSelect = (sectionId: string, subsection: string) => {
    const section = sections.find(s => s.id === sectionId)
    if (section) {
      setSelectedSectionInfo({ title: section.title, subsection })
      form.setValue('section', subsection)
    }
  }

  const handleAiSelection = async () => {
    const problem = form.getValues("problem")
    
    if (!problem || problem.length < 10) {
      setAiError("Пожалуйста, опишите проблему подробнее (минимум 10 символов)")
      return
    }

    setIsAiSelecting(true)
    setAiError(null)

    try {
      const response = await fetch("/api/categorize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          problem,
          carModel: "Dodge", // Здесь будет динамическое значение после реализации выбора машины
          sections: sections.map(section => ({
            id: section.id,
            title: section.title,
            subsections: section.subsections
          }))
        })
      })

      if (!response.ok) {
        throw new Error("Ошибка при подборе категории")
      }

      const result: AiResponse = await response.json()
      
      const selectedSection = sections.find(s => s.id === result.sectionId)
      if (!selectedSection || !selectedSection.subsections.includes(result.subsection)) {
        throw new Error("Некорректный ответ от AI")
      }

      setSelectedSection(result.sectionId)
      setAiSuggestion({ sectionId: result.sectionId, subsection: result.subsection })
    } catch (error) {
      console.error("AI Selection Error:", error)
      setAiError("Не удалось подобрать категорию. Пожалуйста, выберите вручную")
    } finally {
      setIsAiSelecting(false)
    }
  }

  const handleAcceptAiSuggestion = () => {
    if (aiSuggestion) {
      setSelectedSubsection(aiSuggestion.subsection)
      handleSectionSelect(aiSuggestion.sectionId, aiSuggestion.subsection)
      setTimeout(() => {
        setShowSections(false)
        setSelectedSection(null)
        setSelectedSubsection(null)
        setAiSuggestion(null)
      }, 1000)
    }
  }

  return (
    <div className="min-h-[100vh] bg-[#F2F2F7] flex flex-col pb-safe">
      <style jsx global>{`
        body {
          background-color: #F2F2F7;
        }
      `}</style>
      <Card className="w-full border-0 shadow-none bg-transparent flex-1 flex flex-col">
        <CardContent className="p-4 flex-1 flex flex-col">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 flex-1 flex flex-col">
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full h-[52px] text-[17px] font-normal rounded-xl border-0 bg-white
                          shadow-sm relative pl-10 active:bg-[#E5E5EA] transition-colors text-left"
                          onClick={() => setShowSections(true)}
                        >
                          <MapPin className="w-[18px] h-[18px] absolute left-3 text-[#8E8E93]" />
                          <span className="text-[#000000]">{selectedCity}</span>
                        </Button>
                      </FormControl>
                      <FormMessage className="text-[13px] font-normal text-[#FF3B30] mt-1 ml-1" />
                    </FormItem>
                  )}
                />

                <Button 
                  type="button"
                  variant="outline"
                  className="h-[52px] text-[17px] font-normal rounded-xl border-0 bg-white
                  shadow-sm relative pl-10 active:bg-[#E5E5EA] transition-colors text-left"
                >
                  <Car className="w-[18px] h-[18px] absolute left-3 text-[#8E8E93]" />
                  <span className="text-[#000000]">Dodge</span>
                </Button>
              </div>
              
              <FormField
                control={form.control}
                name="problem"
                render={({ field }) => (
                  <FormItem className="flex-1 flex flex-col">
                    <FormControl>
                        <Textarea 
                          placeholder="Опишите проблему" 
                        className="flex-1 text-[17px] resize-none border-0 rounded-xl bg-white
                        shadow-sm focus:ring-2 focus:ring-[#007AFF] focus:ring-offset-0 transition-shadow
                        placeholder:text-[#8E8E93] p-3" 
                          {...field}
                        />
                    </FormControl>
                    <FormMessage className="text-[13px] font-normal text-[#FF3B30] mt-1 ml-1" />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <Button 
                  type="button"
                  variant="outline"
                  className="w-full h-[52px] text-[17px] font-normal rounded-xl border-0 bg-white
                  shadow-sm flex items-center gap-3 justify-center active:bg-[#E5E5EA] transition-colors"
                >
                  <Camera className="w-[18px] h-[18px] text-[#8E8E93] flex-shrink-0" />
                  <span>Фото</span>
                </Button>

                <FormField
                  control={form.control}
                  name="section"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full h-[52px] text-[17px] font-normal rounded-xl border-0 bg-white
                          shadow-sm transition-colors flex items-center justify-between px-3"
                          onClick={() => setShowSections(true)}
                        >
                          <div className="flex items-center gap-3">
                            {selectedSectionInfo ? (
                              <>
                                {sections.find(s => s.title === selectedSectionInfo.title)?.icon && (
                                  <div className="w-[18px] h-[18px] text-[#8E8E93]">
                                    {React.createElement(sections.find(s => s.title === selectedSectionInfo.title)!.icon)}
                                  </div>
                                )}
                                <div className="flex flex-col items-start -space-y-0.5">
                                  <span className="text-[13px] text-[#8E8E93]">{selectedSectionInfo.title}</span>
                                  <span className="text-[#000000]">{selectedSectionInfo.subsection}</span>
                                </div>
                              </>
                            ) : (
                              <span className="text-[#8E8E93]">Выберите раздел</span>
                            )}
                          </div>
                          <ChevronRight className="w-[18px] h-[18px] text-[#8E8E93]" />
                        </Button>
                      </FormControl>
                      <FormMessage className="text-[13px] font-normal text-[#FF3B30] mt-1 ml-1" />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full h-[52px] text-[17px] font-normal rounded-xl border-0
                  bg-[#007AFF] text-white active:bg-[#0051FF] transition-colors
                  disabled:opacity-50 disabled:bg-[#007AFF]"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Подождите..." : "Создать"}
                </Button>

                <div className="flex justify-center items-center space-x-2">
                  <Checkbox
                    id="hideNumber"
                    checked={hideNumber}
                    onCheckedChange={(checked) => setHideNumber(checked as boolean)}
                    className="w-[18px] h-[18px] border-[#8E8E93] data-[state=checked]:bg-[#007AFF] data-[state=checked]:border-[#007AFF]"
                  />
                  <label
                    htmlFor="hideNumber"
                    className="text-[15px] font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Скрыть номер телефона
                  </label>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Модальное окно с разделами */}
      {showSections && (
        <div className="fixed inset-0 bg-[#F2F2F7] z-50 animate-in fade-in slide-in-from-bottom-5">
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center p-4">
              <div className="w-[60px]" />
              <h2 className="text-[17px] font-medium">Выберите раздел</h2>
              <div className="w-[60px]" />
            </div>

            <div className="flex-1 overflow-auto px-4">
              {!selectedSection ? (
                <div className="grid grid-cols-1 gap-3">
                  {sections.map((section) => {
                    const Icon = section.icon
                    return (
                      <Button
                        key={section.id}
                        variant="outline"
                        className={`w-full h-[52px] text-[17px] font-normal rounded-xl border-0 
                        shadow-sm transition-all duration-300 flex items-center justify-between px-3
                        ${isAiSelecting ? 'opacity-50 pointer-events-none' : 'bg-white active:bg-[#E5E5EA]'}`}
                        onClick={() => {
                          setSelectedSection(section.id)
                          setAiSuggestion(null)
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-[18px] h-[18px] text-[#8E8E93]" />
                          <span>{section.title}</span>
                        </div>
                        <ChevronRight className="w-[18px] h-[18px] text-[#8E8E93]" />
                      </Button>
                    )
                  })}

                  <div className="h-[1px] bg-[#E5E5EA] my-3" />

                  <Button
                    variant="outline"
                    className="w-full h-[52px] text-[17px] font-normal rounded-xl border-0 bg-white
                    shadow-sm transition-all duration-300 flex items-center justify-between px-3
                    active:bg-[#E5E5EA]"
                  >
                    <div className="flex items-center gap-3">
                      <HelpCircle className="w-[18px] h-[18px] text-[#8E8E93]" />
                      <span>Поддержка</span>
                    </div>
                    <ChevronRight className="w-[18px] h-[18px] text-[#8E8E93]" />
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 p-0 h-auto text-[17px] hover:bg-transparent"
                    onClick={() => {
                      setSelectedSection(null)
                      setSelectedSubsection(null)
                      setAiSuggestion(null)
                    }}
                  >
                    <ChevronLeft className="w-[18px] h-[18px] text-[#007AFF]" />
                    <span className="text-[#007AFF]">Назад</span>
                  </Button>
                  
                  <div className="grid grid-cols-1 gap-3">
                    {sections
                      .find(s => s.id === selectedSection)
                      ?.subsections.map((subsection) => (
                        <Button
                          key={subsection}
                          variant="outline"
                          className={`w-full h-[52px] text-[17px] font-normal rounded-xl border-0
                          shadow-sm transition-all duration-300 text-left px-3
                          ${aiSuggestion?.subsection === subsection 
                            ? 'bg-[#007AFF] text-white' 
                            : isAiSelecting
                              ? 'opacity-50 pointer-events-none bg-white'
                              : 'bg-white active:bg-[#E5E5EA]'
                          }`}
                          onClick={() => {
                            if (aiSuggestion?.subsection === subsection) {
                              handleAcceptAiSuggestion()
                            } else {
                              setSelectedSubsection(subsection)
                              handleSectionSelect(selectedSection, subsection)
                              setTimeout(() => {
                                setShowSections(false)
                                setSelectedSection(null)
                                setSelectedSubsection(null)
                              }, 1000)
                            }
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <span>{subsection}</span>
                            {aiSuggestion?.subsection === subsection && (
                              <Check className="w-[18px] h-[18px]" />
                            )}
                          </div>
                        </Button>
                      ))}

                    <div className="h-[1px] bg-[#E5E5EA] my-3" />

                    <Button
                      variant="outline"
                      className="w-full h-[52px] text-[17px] font-normal rounded-xl border-0 bg-white
                      shadow-sm transition-all duration-300 flex items-center justify-between px-3
                      active:bg-[#E5E5EA]"
                    >
                      <div className="flex items-center gap-3">
                        <HelpCircle className="w-[18px] h-[18px] text-[#8E8E93]" />
                        <span>Поддержка</span>
                      </div>
                      <ChevronRight className="w-[18px] h-[18px] text-[#8E8E93]" />
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 space-y-3">
              {aiError && (
                <div className="text-[#FF3B30] text-[15px] text-center mb-2">
                  {aiError}
                </div>
              )}
              
              {aiSuggestion ? (
                <Button
                  variant="outline"
                  className="w-full h-[52px] text-[17px] font-normal rounded-xl border-0 bg-[#007AFF]
                  shadow-sm transition-all duration-300 flex items-center justify-center gap-2 text-white"
                  onClick={handleAcceptAiSuggestion}
                >
                  <Check className="w-[18px] h-[18px]" />
                  <span>Подтвердить выбор</span>
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className={`w-full h-[52px] text-[17px] font-normal rounded-xl border-0 bg-white
                  shadow-sm transition-all duration-300 flex items-center justify-center gap-2
                  ${isAiSelecting ? 'bg-[#007AFF] text-white' : 'active:bg-[#E5E5EA]'}`}
                  onClick={handleAiSelection}
                  disabled={isAiSelecting}
                >
                  {isAiSelecting ? (
                    <>
                      <Loader2 className="w-[18px] h-[18px] animate-spin" />
                      <span>Подбираем раздел...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-[18px] h-[18px] text-[#007AFF]" />
                      <span className="text-[#007AFF]">Подобрать с помощью ИИ</span>
                    </>
                  )}
                </Button>
              )}

              <Button
                variant="outline"
                className="w-full h-[52px] text-[17px] font-normal rounded-xl border-0 bg-white
                shadow-sm transition-all duration-300 active:bg-[#E5E5EA]"
                onClick={() => {
                  setShowSections(false)
                  setSelectedSection(null)
                  setSelectedSubsection(null)
                  setAiSuggestion(null)
                  setAiError(null)
                }}
              >
                Закрыть
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CarProblemForm 