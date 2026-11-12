import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchUsers, type UserSearchResult } from "@/services/UserService";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { Input } from "@/styles/inputs";
import { Wrapper, SuggestionList, SuggestionItem, SuggestionAvatar } from "./styles";

const FALLBACK_AVATAR =
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80";

type MentionInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  InputComponent?: React.ComponentType<
    React.InputHTMLAttributes<HTMLInputElement> & React.RefAttributes<HTMLInputElement>
  >;
};

export function MentionInput({ value, onChange, placeholder, disabled, InputComponent = Input }: MentionInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [mentionQuery, setMentionQuery] = useState<string | null>(null);
  const [triggerStart, setTriggerStart] = useState<number | null>(null);
  const [cursorPos, setCursorPos] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const debouncedQuery = useDebouncedValue(mentionQuery ?? "", 250);

  const { data } = useQuery({
    queryKey: ["user-search", debouncedQuery],
    queryFn: async () => (await searchUsers(debouncedQuery)).data.data,
    enabled: debouncedQuery.length > 0,
  });

  const suggestions = mentionQuery !== null ? data ?? [] : [];

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newValue = e.target.value;
    const cursor = e.target.selectionStart ?? newValue.length;
    onChange(newValue);

    const match = newValue.slice(0, cursor).match(/@(\w*)$/);
    if (match) {
      setMentionQuery(match[1]);
      setTriggerStart(cursor - match[0].length);
      setCursorPos(cursor);
    } else {
      setMentionQuery(null);
    }
    setActiveIndex(0);
  }

  function selectSuggestion(user: UserSearchResult) {
    if (triggerStart === null || cursorPos === null) return;
    const before = value.slice(0, triggerStart);
    const after = value.slice(cursorPos);
    onChange(`${before}@${user.username} ${after}`);
    setMentionQuery(null);

    requestAnimationFrame(() => {
      const pos = before.length + user.username.length + 2;
      inputRef.current?.setSelectionRange(pos, pos);
      inputRef.current?.focus();
    });
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (mentionQuery === null || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      selectSuggestion(suggestions[activeIndex]);
    } else if (e.key === "Escape") {
      setMentionQuery(null);
    }
  }

  return (
    <Wrapper>
      <InputComponent
        ref={inputRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={() => setTimeout(() => setMentionQuery(null), 150)}
        placeholder={placeholder}
        disabled={disabled}
      />
      {mentionQuery !== null && suggestions.length > 0 && (
        <SuggestionList>
          {suggestions.map((u, i) => (
            <SuggestionItem
              key={u.id}
              $active={i === activeIndex}
              onMouseDown={(e) => {
                e.preventDefault();
                selectSuggestion(u);
              }}
            >
              <SuggestionAvatar src={u.avatar || FALLBACK_AVATAR} alt={u.username} />
              <span>@{u.username}</span>
            </SuggestionItem>
          ))}
        </SuggestionList>
      )}
    </Wrapper>
  );
}
