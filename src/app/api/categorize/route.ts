import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

interface Section {
  id: string
  title: string
  subsections: string[]
}

export async function POST(request: Request) {
  try {
    const { problem, sections, carModel = "" } = await request.json()

    if (!problem || !sections) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const sectionsFormatted = sections.map((section: Section) => 
      `ID: "${section.id}" - ${section.title}:\n${section.subsections.map(sub => `- "${sub}"`).join('\n')}`
    ).join('\n\n')

    const systemPrompt = `Ты - опытный автомеханик с глубоким пониманием различных марок автомобилей и их специфических проблем. 
Твоя задача - точно определить категорию проблемы на основе описания и контекста.

Важные аспекты для анализа:
1. Специфика описанной проблемы
2. Марка и модель автомобиля (если указана)
3. Возможные связанные системы автомобиля
4. Срочность и критичность проблемы
5. Потенциальные риски

При выборе категории учитывай:
- Прямые указания на проблему в описании
- Косвенные признаки и симптомы
- Специфические особенности указанной марки автомобиля
- Наиболее вероятные причины описанных симптомов
- Оптимальный путь решения проблемы`

    const userPrompt = `Проанализируй проблему с автомобилем и выбери наиболее подходящую категорию и подкатегорию.

Автомобиль: ${carModel || "Марка не указана"}
Описание проблемы: "${problem}"

Доступные категории и подкатегории (используй точные значения в кавычках):
${sectionsFormatted}

ВАЖНО: Используй только ID и названия подкатегорий, указанные в кавычках выше.

Ответь строго в формате JSON:
{
  "sectionId": "точный ID категории в кавычках из списка выше",
  "subsection": "точное название подкатегории в кавычках из списка выше",
  "explanation": "Подробное объяснение выбора"
}

ВАЖНО:
1. Используй только существующие ID и названия из списка выше, строго как указано в кавычках
2. Убедись, что выбранная подкатегория существует в указанной категории
3. Объяснение должно четко обосновывать выбор`

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: userPrompt
        }
      ],
      model: "gpt-4o",
      temperature: 0.2,
      response_format: { type: "json_object" }
    })

    const result = JSON.parse(completion.choices[0].message.content || "{}")

    // Валидация ответа
    const selectedSection = sections.find((s: Section) => s.id === result.sectionId)
    if (!selectedSection || !selectedSection.subsections.includes(result.subsection)) {
      throw new Error("Invalid AI response")
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Categorization Error:", error)
    return NextResponse.json(
      { error: "Failed to categorize the problem" },
      { status: 500 }
    )
  }
} 