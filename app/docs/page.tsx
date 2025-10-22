'use client'

import { useState, ReactNode } from 'react'
import { FileText, Code, Layout, ArrowLeft, Sparkles, LucideIcon } from 'lucide-react'

interface Doc {
    id: string
    icon: LucideIcon
    title: string
    content: string
    desc: string
}

const STRUCTURE_MD = `## Root Architecture

\`\`\`
3prints-auth/
├── project/
│   ├── auth/              # Authentication
│   ├── core/              # Shared base classes
│   ├── security/          # Security utilities
│   ├── middleware/        # Request interceptors
│   └── utils/             # Database, config
├── TEMPLATE_FILES/
│   ├── auth/, core/, security/
│   └── shared/
└── alembic/
\`\`\`

## Auth Module

\`\`\`
project/auth/
├── models.py      # User, Session, RefreshToken
├── schemas.py     # Request/response schemas
├── service.py     # Business logic
└── views.py       # API endpoints
\`\`\`

## Security Module

\`\`\`
project/security/
├── password.py    # Argon2 + breach check
├── token.py       # JWT + blacklist
├── rate_limit.py  # Redis limiter
└── session.py     # Device tracking
\`\`\`

## Middleware Stack

\`\`\`
project/middleware/
├── auth.py           # Extract + validate tokens
├── rate_limit.py     # IP + user-based limiting
├── audit.py          # Log all requests
└── cors.py           # CORS + CSRF protection
\`\`\`

## Database Models

### User Model
\`\`\`python
users
  - id (UUID, PK)
  - email (String, unique, indexed)
  - password_hash (String)
  - supabase_user_id (UUID, unique, nullable)
  - email_verified (Boolean, default=False)
  - locked_until (DateTime, nullable)
  - failed_login_attempts (Integer, default=0)
  - is_active (Boolean, default=True)
  - deleted_at (DateTime, nullable)
  - created_at, updated_at
\`\`\`

### RefreshToken Model
\`\`\`python
refresh_tokens
  - id (UUID, PK)
  - user_id (UUID, FK)
  - token_hash (String, unique, indexed)
  - device_id (String)
  - device_fingerprint (String)
  - ip_address (String)
  - expires_at (DateTime)
  - revoked_at (DateTime, nullable)
  - created_at
\`\`\`

### UserSession Model
\`\`\`python
user_sessions
  - id (UUID, PK)
  - user_id (UUID, FK)
  - refresh_token_id (UUID, FK)
  - device_fingerprint (String)
  - ip_address (String)
  - last_active (DateTime)
  - expires_at (DateTime)
\`\`\``

const FEATURES_MD = `## Feature: User Registration with Email Verification

**Type:** API + Model + Security + Email

**Entities:** User, EmailVerificationToken

**Endpoints:**
- POST /api/auth/register
- POST /api/auth/verify-email
- POST /api/auth/resend-verification

**Backend Logic:**
- Hash password with Argon2
- Check email uniqueness
- Generate verification token (UUID)
- Store token with 24h expiry
- Send verification email via Supabase
- Rate limit: 3 registrations/hour per IP

**Security:**
- Password min 8 chars, breach check via HIBP
- Email validation with disposable domain check
- Token is one-time use, expires after verification

**Frontend:**
- Components: RegisterForm, VerifyEmailPage
- Form validation before submit
- Show verification sent message
- Resend button after 60s cooldown
- State: email, password, isSubmitting, error

---

## Feature: Session Management with Device Tracking

**Type:** API + Model + Redis + Security

**Entities:** UserSession, RefreshToken

**Endpoints:**
- GET /api/auth/sessions (list active sessions)
- DELETE /api/auth/sessions/:id (revoke session)
- DELETE /api/auth/sessions/all (revoke all)

**Backend Logic:**
- Track device fingerprint (user-agent + IP hash)
- Store session metadata: device, IP, location, last_active
- Enforce max 3 concurrent sessions per user
- Auto-cleanup sessions older than 30 days
- Redis cache for fast session lookup

**Security:**
- Bind refresh token to device fingerprint
- Detect suspicious device changes
- Lock account if >5 sessions created in 1h
- Notify user via email on new device login

**Frontend:**
- Components: SessionsList, SessionCard, RevokeButton
- Display: device type, browser, IP, last active
- Current session highlighted
- Confirm modal before revoke all
- State: sessions[], isLoading, selectedSession

---

## Feature: Password Reset Flow

**Type:** API + Email + Security

**Entities:** User, PasswordResetToken

**Endpoints:**
- POST /api/auth/forgot-password
- POST /api/auth/reset-password
- POST /api/auth/validate-reset-token

**Backend Logic:**
- Generate secure reset token
- Send email with reset link
- Token expires in 1 hour
- Validate token before password change
- Prevent password reuse (last 5 passwords)

**Security:**
- Rate limit: 3 requests/hour per email
- Token is single-use
- Invalidate all sessions on password change
- Log password change events

**Frontend:**
- Components: ForgotPasswordForm, ResetPasswordForm
- Email input with validation
- Token validation on page load
- Password strength indicator
- Success redirect to login`

const TEMPLATES_MD = `## Model Template

\`\`\`python
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from project.utils.database import Base


class {{MODEL_NAME}}(Base):
    """{{MODEL_DOCSTRING}}"""
    __tablename__ = "{{TABLE_NAME}}"

    # Primary Key
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    # Fields
    {{FIELD_DEFINITIONS}}

    # Timestamps
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow,
                       onupdate=datetime.utcnow)

    # Relationships
    {{RELATIONSHIPS}}

    def __repr__(self):
        return f"<{{MODEL_NAME}}(id={self.id})>"
\`\`\`

---

## Schema Template

\`\`\`python
from pydantic import BaseModel, field_validator
from datetime import datetime
from typing import Optional
from uuid import UUID


class {{MODEL_NAME}}Create(BaseModel):
    """Request schema for creating {{MODEL_NAME}}"""
    {{CREATE_FIELDS}}

    {{VALIDATORS}}


class {{MODEL_NAME}}Update(BaseModel):
    """Request schema for updating {{MODEL_NAME}}"""
    {{UPDATE_FIELDS}}


class {{MODEL_NAME}}Public(BaseModel):
    """Response schema for {{MODEL_NAME}}"""
    id: UUID
    {{PUBLIC_FIELDS}}
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class {{MODEL_NAME}}List(BaseModel):
    """Response schema for list of {{MODEL_NAME}}"""
    items: list[{{MODEL_NAME}}Public]
    total: int
    page: int
    page_size: int
\`\`\`

---

## Service Template

\`\`\`python
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete
from typing import Optional, List
from uuid import UUID
import logging

from project.{{MODULE_NAME}}.models import {{MODEL_NAME}}
from project.{{MODULE_NAME}}.schemas import (
    {{MODEL_NAME}}Create,
    {{MODEL_NAME}}Update
)

logger = logging.getLogger(__name__)


async def create_{{ENTITY_NAME}}(
    data: {{MODEL_NAME}}Create,
    db: AsyncSession
) -> {{MODEL_NAME}}:
    """Create new {{ENTITY_NAME}}"""
    new_item = {{MODEL_NAME}}(**data.model_dump())
    db.add(new_item)
    await db.commit()
    await db.refresh(new_item)
    return new_item


async def get_{{ENTITY_NAME}}(
    id: UUID,
    db: AsyncSession
) -> Optional[{{MODEL_NAME}}]:
    """Get {{ENTITY_NAME}} by ID"""
    result = await db.execute(
        select({{MODEL_NAME}}).where({{MODEL_NAME}}.id == id)
    )
    return result.scalar_one_or_none()


async def list_{{ENTITY_NAME_PLURAL}}(
    db: AsyncSession,
    skip: int = 0,
    limit: int = 100
) -> List[{{MODEL_NAME}}]:
    """List {{ENTITY_NAME_PLURAL}} with pagination"""
    query = select({{MODEL_NAME}}).offset(skip).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()


async def update_{{ENTITY_NAME}}(
    id: UUID,
    data: {{MODEL_NAME}}Update,
    db: AsyncSession
) -> Optional[{{MODEL_NAME}}]:
    """Update {{ENTITY_NAME}}"""
    item = await get_{{ENTITY_NAME}}(id, db)
    if not item:
        return None

    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(item, key, value)

    await db.commit()
    await db.refresh(item)
    return item


async def delete_{{ENTITY_NAME}}(
    id: UUID,
    db: AsyncSession
) -> bool:
    """Delete {{ENTITY_NAME}}"""
    result = await db.execute(
        delete({{MODEL_NAME}}).where({{MODEL_NAME}}.id == id)
    )
    await db.commit()
    return result.rowcount > 0
\`\`\`

---

## Views Template

\`\`\`python
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from uuid import UUID

from project.{{MODULE_NAME}}.schemas import (
    {{MODEL_NAME}}Create,
    {{MODEL_NAME}}Update,
    {{MODEL_NAME}}Public,
    {{MODEL_NAME}}List
)
from project.{{MODULE_NAME}} import service
from project.utils.database import get_db
from project.utils.responses import success_response

router = APIRouter(
    prefix="/{{ENDPOINT_PREFIX}}",
    tags=["{{TAG_NAME}}"]
)


@router.post("/", response_model=dict, status_code=status.HTTP_201_CREATED)
async def create_{{ENDPOINT_NAME}}(
    data: {{MODEL_NAME}}Create,
    db: AsyncSession = Depends(get_db)
):
    """Create new {{ENTITY_NAME}}"""
    item = await service.create_{{ENTITY_NAME}}(data, db)
    return success_response(
        data={{MODEL_NAME}}Public.model_validate(item).model_dump(mode="json"),
        message="{{ENTITY_NAME}} created successfully"
    )


@router.get("/{id}", response_model=dict)
async def get_{{ENDPOINT_NAME}}(
    id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Get {{ENTITY_NAME}} by ID"""
    item = await service.get_{{ENTITY_NAME}}(id, db)
    if not item:
        raise HTTPException(status_code=404, detail="Not found")

    return success_response(
        data={{MODEL_NAME}}Public.model_validate(item).model_dump(mode="json")
    )


@router.get("/", response_model=dict)
async def list_{{ENDPOINT_NAME_PLURAL}}(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
):
    """List {{ENTITY_NAME_PLURAL}} with pagination"""
    items = await service.list_{{ENTITY_NAME_PLURAL}}(db, skip, limit)

    return success_response(
        data={{MODEL_NAME}}List(
            items=[{{MODEL_NAME}}Public.model_validate(i) for i in items],
            total=len(items),
            page=skip // limit + 1,
            page_size=limit
        ).model_dump(mode="json")
    )


@router.put("/{id}", response_model=dict)
async def update_{{ENDPOINT_NAME}}(
    id: UUID,
    data: {{MODEL_NAME}}Update,
    db: AsyncSession = Depends(get_db)
):
    """Update {{ENTITY_NAME}}"""
    item = await service.update_{{ENTITY_NAME}}(id, data, db)
    if not item:
        raise HTTPException(status_code=404, detail="Not found")

    return success_response(
        data={{MODEL_NAME}}Public.model_validate(item).model_dump(mode="json"),
        message="Updated successfully"
    )


@router.delete("/{id}", response_model=dict)
async def delete_{{ENDPOINT_NAME}}(
    id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Delete {{ENTITY_NAME}}"""
    success = await service.delete_{{ENTITY_NAME}}(id, db)
    if not success:
        raise HTTPException(status_code=404, detail="Not found")

    return success_response(message="Deleted successfully")
\`\`\``

const docs: Doc[] = [
    { id: 'structure', icon: Layout, title: 'Structure.md', content: STRUCTURE_MD, desc: 'System architecture blueprint' },
    { id: 'features', icon: FileText, title: 'Features.md', content: FEATURES_MD, desc: 'Feature specifications' },
    { id: 'templates', icon: Code, title: 'Templates.md', content: TEMPLATES_MD, desc: 'Code generation patterns' }
]

const FeatureSection = ({ label, children }: { label: string; children: ReactNode }) => (
    <div className="border-l-4 border-cyan-400 bg-cyan-50/50 px-6 py-4 rounded-r mb-4">
        <div className="font-bold text-slate-800 text-lg mb-2">{label}</div>
        <div className="text-slate-700 space-y-1">{children}</div>
    </div>
)

const MarkdownRenderer = ({ content }: { content: string }) => {
    const lines = content.split('\n')
    let inCodeBlock = false
    const codeLines: string[] = []
    let currentSection: { label: string; content: string[] } | null = null
    const elements: ReactNode[] = []

    lines.forEach((line: string, i: number) => {
        // Code block handling
        if (line.trim() === '```' || line.trim().startsWith('```')) {
            if (inCodeBlock) {
                elements.push(
                    <pre key={`code-${i}`} className="bg-slate-900 text-cyan-300 px-6 py-4 rounded-lg overflow-x-auto font-mono text-sm leading-relaxed mb-6 border border-slate-700">
                        {codeLines.join('\n')}
                    </pre>
                )
                codeLines.length = 0
                inCodeBlock = false
            } else {
                inCodeBlock = true
            }
            return
        }

        if (inCodeBlock) {
            codeLines.push(line)
            return
        }

        // Headers
        if (line.startsWith('# ')) {
            elements.push(
                <h1 key={i} className="text-4xl font-bold text-slate-900 mt-8 mb-6 pb-3 border-b-2 border-slate-200">
                    {line.slice(2)}
                </h1>
            )
        } else if (line.startsWith('## ')) {
            elements.push(
                <h2 key={i} className="text-2xl font-bold text-slate-800 mt-8 mb-5 flex items-center gap-3">
                    <Sparkles className="w-6 h-6 text-cyan-500" />
                    {line.slice(3)}
                </h2>
            )
        } else if (line.startsWith('### ')) {
            elements.push(
                <h3 key={i} className="text-xl font-semibold text-slate-700 mt-6 mb-3">
                    {line.slice(4)}
                </h3>
            )
        }
        // Feature sections
        else if (line.startsWith('**') && line.includes(':**')) {
            const match = line.match(/\*\*(.+?):\*\*(.*)/)
            if (match) {
                currentSection = { label: match[1], content: [match[2].trim()] }
            }
        }
        // List items for feature sections
        else if (line.trim().startsWith('- ') && currentSection) {
            currentSection.content.push(line.trim().slice(2))
        }
        // Close feature section
        else if (line.trim() === '' && currentSection) {
            const section = currentSection
            elements.push(
                <FeatureSection key={`section-${i}`} label={section.label}>
                    {section.content.map((item: string, j: number) => (
                        <div key={j} className="flex items-start gap-2">
                            {j > 0 && <span className="text-cyan-500 font-bold mt-0.5">•</span>}
                            <span>{item}</span>
                        </div>
                    ))}
                </FeatureSection>
            )
            currentSection = null
        }
        // Horizontal rule
        else if (line.trim() === '---') {
            elements.push(<hr key={i} className="my-10 border-t-2 border-slate-200" />)
        }
        // Regular text
        else if (line.trim() && !line.startsWith('**')) {
            elements.push(
                <p key={i} className="text-slate-600 leading-relaxed mb-4">
                    {line}
                </p>
            )
        }
    })

    return <div>{elements}</div>
}

export default function DocsPage() {
    const [selected, setSelected] = useState<Doc | null>(null)

    return (
        <div className="min-h-screen bg-white">
            {!selected ? (
                <div className="max-w-6xl mx-auto px-6 py-20">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 bg-cyan-100 text-cyan-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                            <Sparkles className="w-4 h-4" />
                            AI-Powered Architecture
                        </div>
                        <h1 className="text-5xl font-bold text-slate-900 mb-4">
                            Documentation
                        </h1>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Explore how Archai thinks structurally and builds intelligently
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {docs.map(doc => {
                            const Icon = doc.icon
                            return (
                                <button
                                    key={doc.id}
                                    onClick={() => setSelected(doc)}
                                    className="group bg-white p-8 rounded-2xl border-2 border-slate-200 hover:border-cyan-400 hover:shadow-xl hover:shadow-cyan-100/50 transition-all duration-300 text-left"
                                >
                                    <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <Icon className="w-7 h-7 text-cyan-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-cyan-600 transition-colors">
                                        {doc.title}
                                    </h3>
                                    <p className="text-sm text-slate-500">{doc.desc}</p>
                                </button>
                            )
                        })}
                    </div>
                </div>
            ) : (
                <div className="max-w-5xl mx-auto px-6 py-12">
                    <button
                        onClick={() => setSelected(null)}
                        className="flex items-center gap-2 text-cyan-600 hover:text-cyan-700 font-medium mb-10 group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Documentation
                    </button>

                    <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 px-8 py-6">
                            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                                {(() => {
                                    const Icon = selected.icon
                                    return <Icon className="w-8 h-8" />
                                })()}
                                {selected.title}
                            </h1>
                        </div>

                        <div className="p-10 md:p-12">
                            <MarkdownRenderer content={selected.content} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}