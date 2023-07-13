import { component$, JSXNode, PropFunction, Slot, useSignal } from '@builder.io/qwik';

type DropdownMenuItem = {
  key: string;
  label: JSXNode | string;
  show: boolean;
  onClick$?: PropFunction<() => void>;
};

type Props = {
  size?: 'sm' | 'md' | 'lg';
  align?: 'left' | 'right';
  placement?: 'top' | 'bottom';
  keepOpenOnMenuClick?: boolean;
  childClass?: string;
  menuItems: DropdownMenuItem[];
};

export const Dropdown = component$((props: Props) => {
  const isOpen = useSignal(false);

  return (
    <div
      class={`dropdown ${props.align === 'right' ? 'dropdown-end' : ''} ${
        props.placement === 'top' ? 'dropdown-top' : 'dropdown-bottom'
      }`}
      onBlur$={({ relatedTarget }, currentTarget) => {
        // currentTarget is the label
        // relatedTarget is the new focused element
        if (relatedTarget instanceof HTMLElement && currentTarget.contains(relatedTarget)) return;
        isOpen.value = false;
      }}
    >
      <label
        tabIndex={0}
        class={`btn ${props.size === 'lg' ? 'btn-lg' : props.size === 'md' ? 'btn-md' : 'btn-sm'} ${
          props.childClass ?? ''
        }`}
        onClick$={() => {
          isOpen.value = !isOpen.value;
        }}
      >
        <Slot />
      </label>
      <ul
        tabIndex={0}
        class="dropdown-content menu menu-compact outline bg-base-100 rounded w-fit"
        style={{
          minWidth: '200px',
          visibility: isOpen ? 'visible' : 'hidden',
        }}
      >
        {props.menuItems
          .filter((item) => item.show)
          .map((item) => {
            const onClick = item.onClick$;
            const keepOpenOnMenuClick = props.keepOpenOnMenuClick;

            return onClick ? (
              <li key={item.key}>
                <a
                  onClick$={() => {
                    if (onClick) {
                      onClick();
                      if (!keepOpenOnMenuClick) {
                        isOpen.value = false;
                      }
                    }
                  }}
                >
                  {item.label}
                </a>
              </li>
            ) : (
              <li key={item.key} class="menu-title">
                {item.label}
              </li>
            );
          })}
      </ul>
    </div>
  );
});
