from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.session import get_db
from app.models.models import ReportTask, Municipality
from app.core.config import settings
import openai
import uuid
from datetime import datetime

openai.api_key = settings.openai_api_key

router = APIRouter()

@router.post("/generate")
async def generate_report(
    mo_id: int,
    horizon: int,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Municipality).where(Municipality.id == mo_id))
    mo = result.scalar()
    if not mo:
        raise HTTPException(status_code=404, detail="Municipality not found")

    task_id = str(uuid.uuid4())
    task = ReportTask(
        task_id=task_id,
        mo_id=mo_id,
        horizon=horizon,
        status="pending",
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    db.add(task)
    await db.commit()

    background_tasks.add_task(process_report, task_id, mo_id, horizon, db)

    return {"task_id": task_id}

@router.get("/status/{task_id}")
async def get_report_status(task_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ReportTask).where(ReportTask.task_id == task_id))
    task = result.scalar()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    return {"status": task.status, "content": task.content if task.status == "completed" else None}

async def process_report(task_id: str, mo_id: int, horizon: int, db: AsyncSession):
    await db.execute(f"UPDATE report_tasks SET status='processing', updated_at=NOW() WHERE task_id='{task_id}'")
    await db.commit()

    data_summary = f"Data for MO {mo_id}, horizon {horizon}"

    prompt = f"Generate an analytical report for municipality {mo_id} with forecast horizon {horizon}. Data: {data_summary}"
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}]
        )
        content = response.choices[0].message.content
    except Exception as e:
        content = f"Error generating report: {str(e)}"
        await db.execute(f"UPDATE report_tasks SET status='failed', content='{content}', updated_at=NOW() WHERE task_id='{task_id}'")
        await db.commit()
        return

    await db.execute(f"UPDATE report_tasks SET status='completed', content='{content}', updated_at=NOW() WHERE task_id='{task_id}'")
    await db.commit()

@router.get("/download/{task_id}")
async def download_report(task_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ReportTask).where(ReportTask.task_id == task_id))
    task = result.scalar()
    if not task or task.status != "completed":
        raise HTTPException(status_code=404, detail="Report not ready")

    from reportlab.pdfgen import canvas
    from io import BytesIO
    buffer = BytesIO()
    p = canvas.Canvas(buffer)
    p.drawString(100, 750, task.content)
    p.showPage()
    p.save()
    buffer.seek(0)

    from fastapi.responses import StreamingResponse
    return StreamingResponse(buffer, media_type="application/pdf", headers={"Content-Disposition": "attachment; filename=report.pdf"})