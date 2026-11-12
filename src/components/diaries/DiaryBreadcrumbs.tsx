export interface DiaryBreadcrumbItem {
  label: string
  href?: string
  onClick?: () => void
}

function Chevron() {
  return (
    <svg
      width="10"
      height="12"
      viewBox="0 0 10 12"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M1.5 1.5 6 6l-4.5 4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/**
 * Header breadcrumb for the diaries section:
 * section → folder → active diary.
 */
export function DiaryBreadcrumbs({
  items,
}: {
  items: DiaryBreadcrumbItem[]
}) {
  if (items.length === 0) {
    return null
  }

  return (
    <nav className="diary-breadcrumbs" aria-label="Breadcrumb">
      <ol className="diary-breadcrumbs__list">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          const label = (
            <span className="diary-breadcrumbs__label" title={item.label}>
              {item.label}
            </span>
          )

          return (
            <li
              className="diary-breadcrumbs__item"
              key={`${item.label}-${index}`}
            >
              {isLast ? (
                <span
                  className="diary-breadcrumbs__current"
                  aria-current="page"
                >
                  {label}
                </span>
              ) : item.href ? (
                <a
                  className="diary-breadcrumbs__link"
                  href={item.href}
                  onClick={item.onClick}
                >
                  {label}
                </a>
              ) : (
                <button
                  type="button"
                  className="diary-breadcrumbs__link diary-breadcrumbs__button"
                  onClick={item.onClick}
                >
                  {label}
                </button>
              )}

              {!isLast && (
                <span
                  className="diary-breadcrumbs__separator"
                  aria-hidden="true"
                >
                  <Chevron />
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
