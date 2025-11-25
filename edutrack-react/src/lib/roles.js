const ROLE_LABEL_BY_API = {
  admin: "administrador",
  docente: "docente",
  estudiante: "estudiante",
}

const ROLE_API_BY_UI = Object.entries(ROLE_LABEL_BY_API).reduce((acc, [apiRole, uiRole]) => {
  acc[uiRole] = apiRole
  return acc
}, {})

export function mapApiRoleToUi(role) {
  if (!role) return undefined
  const normalized = role.toLowerCase()
  return ROLE_LABEL_BY_API[normalized] ?? role
}

export function mapUiRoleToApi(label) {
  if (!label) return undefined
  const normalized = label.toLowerCase()
  return ROLE_API_BY_UI[normalized] ?? normalized
}

export function getDefaultRouteForRole(apiRole) {
  if (!apiRole) return "/"
  const normalized = apiRole.toLowerCase()
  switch (normalized) {
    case "admin":
      return "/administrador/dashboard"
    case "docente":
      return "/docente/dashboard"
    case "estudiante":
      return "/estudiante/dashboard"
    default:
      return "/"
  }
}
