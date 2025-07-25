import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
} from '../form';
import { Input } from '../input';
import { Button } from '../button';

// Mock Radix UI components
vi.mock('@radix-ui/react-slot', () => ({
  Slot: React.forwardRef<any, any>(({ children, ...props }, ref) => {
    // Clone the child element and pass through props
    if (React.isValidElement(children)) {
      return React.cloneElement(children, { ...props, ref });
    }
    return children;
  }),
}));

vi.mock('@radix-ui/react-label', () => ({
  Root: React.forwardRef<HTMLLabelElement, any>(({ children, ...props }, ref) => (
    <label ref={ref} {...props}>
      {children}
    </label>
  )),
}));

// Mock ResizeObserver
beforeAll(() => {
  global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));
});

// Test form schema
const testSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  age: z.number().min(18, {
    message: "You must be at least 18 years old.",
  }),
});

type TestFormValues = z.infer<typeof testSchema>;

// Test form component
const TestForm = ({ onSubmit, defaultValues }: {
  onSubmit?: (values: TestFormValues) => void;
  defaultValues?: Partial<TestFormValues>;
}) => {
  const form = useForm<TestFormValues>({
    resolver: zodResolver(testSchema),
    defaultValues: {
      username: "",
      email: "",
      age: 0,
      ...defaultValues,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit || (() => {}))} className="space-y-8" role="form">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Enter username" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Enter email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="age"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Age</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="Enter age" 
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

describe('Form Components', () => {
  describe('Form', () => {
    it('should render form with all components', () => {
      render(<TestForm />);
      
      expect(screen.getByLabelText('Username')).toBeInTheDocument();
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByLabelText('Age')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
    });

    it('should handle form submission with valid data', async () => {
      const handleSubmit = vi.fn();
      const user = userEvent.setup();
      
      render(<TestForm onSubmit={handleSubmit} />);
      
      const usernameInput = screen.getByLabelText('Username');
      const emailInput = screen.getByLabelText('Email');
      const ageInput = screen.getByLabelText('Age');
      const submitButton = screen.getByRole('button', { name: 'Submit' });
      
      await user.type(usernameInput, 'testuser');
      await user.type(emailInput, 'test@example.com');
      await user.type(ageInput, '25');
      await user.click(submitButton);
      
      expect(handleSubmit).toHaveBeenCalledWith({
        username: 'testuser',
        email: 'test@example.com',
        age: 25,
      }, expect.any(Object));
    });

    it('should display validation errors for invalid data', async () => {
      const user = userEvent.setup();
      const handleSubmit = vi.fn();

      render(<TestForm onSubmit={handleSubmit} />);

      const usernameInput = screen.getByLabelText('Username');
      const emailInput = screen.getByLabelText('Email');
      const ageInput = screen.getByLabelText('Age');
      const submitButton = screen.getByRole('button', { name: 'Submit' });

      await user.type(usernameInput, 'a'); // Too short
      await user.type(emailInput, 'invalid-email'); // Invalid email
      await user.clear(ageInput);
      await user.type(ageInput, '16'); // Too young
      await user.click(submitButton);

      // Form should not submit with invalid data
      expect(handleSubmit).not.toHaveBeenCalled();

      // Check that inputs have the invalid values
      expect(usernameInput).toHaveValue('a');
      expect(emailInput).toHaveValue('invalid-email');
      expect(ageInput).toHaveValue(16);
    });

    it('should render with default values', () => {
      render(
        <TestForm 
          defaultValues={{
            username: 'defaultuser',
            email: 'default@example.com',
            age: 30,
          }}
        />
      );
      
      expect(screen.getByDisplayValue('defaultuser')).toBeInTheDocument();
      expect(screen.getByDisplayValue('default@example.com')).toBeInTheDocument();
      expect(screen.getByDisplayValue('30')).toBeInTheDocument();
    });
  });

  describe('FormItem', () => {
    it('should render with default props', () => {
      const TestFormItem = () => {
        const form = useForm();
        return (
          <Form {...form}>
            <FormField
              control={form.control}
              name="test"
              render={() => (
                <FormItem>
                  <FormLabel>Test Label</FormLabel>
                  <FormControl>
                    <Input />
                  </FormControl>
                </FormItem>
              )}
            />
          </Form>
        );
      };
      
      render(<TestFormItem />);
      
      const formItem = screen.getByTestId('form-item');
      expect(formItem).toBeInTheDocument();
      expect(formItem).toHaveClass('space-y-2');
    });

    it('should render with custom className', () => {
      const TestFormItem = () => {
        const form = useForm();
        return (
          <Form {...form}>
            <FormField
              control={form.control}
              name="test"
              render={() => (
                <FormItem className="custom-form-item">
                  <FormLabel>Test Label</FormLabel>
                  <FormControl>
                    <Input />
                  </FormControl>
                </FormItem>
              )}
            />
          </Form>
        );
      };
      
      render(<TestFormItem />);
      
      const formItem = screen.getByTestId('form-item');
      expect(formItem).toHaveClass('custom-form-item');
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      
      const TestFormItem = () => {
        const form = useForm();
        return (
          <Form {...form}>
            <FormField
              control={form.control}
              name="test"
              render={() => (
                <FormItem ref={ref}>
                  <FormLabel>Test Label</FormLabel>
                  <FormControl>
                    <Input />
                  </FormControl>
                </FormItem>
              )}
            />
          </Form>
        );
      };
      
      render(<TestFormItem />);
      
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('FormLabel', () => {
    it('should render with default props', () => {
      const TestFormLabel = () => {
        const form = useForm();
        return (
          <Form {...form}>
            <FormField
              control={form.control}
              name="test"
              render={() => (
                <FormItem>
                  <FormLabel>Test Label</FormLabel>
                  <FormControl>
                    <Input />
                  </FormControl>
                </FormItem>
              )}
            />
          </Form>
        );
      };
      
      render(<TestFormLabel />);
      
      const label = screen.getByTestId('form-label');
      expect(label).toBeInTheDocument();
      expect(label).toHaveTextContent('Test Label');
    });

    it('should apply error styling when field has error', async () => {
      const user = userEvent.setup();

      render(<TestForm />);

      const submitButton = screen.getByRole('button', { name: 'Submit' });
      await user.click(submitButton); // Trigger validation

      const usernameLabel = screen.getAllByTestId('form-label')[0];
      expect(usernameLabel).toHaveClass('text-destructive');
    });

    it('should be associated with form control', () => {
      const TestFormLabel = () => {
        const form = useForm();
        return (
          <Form {...form}>
            <FormField
              control={form.control}
              name="test"
              render={() => (
                <FormItem>
                  <FormLabel>Test Label</FormLabel>
                  <FormControl>
                    <Input />
                  </FormControl>
                </FormItem>
              )}
            />
          </Form>
        );
      };

      render(<TestFormLabel />);

      const label = screen.getByTestId('form-label');
      const input = screen.getByRole('textbox');

      expect(label).toHaveAttribute('for');
      expect(input).toHaveAttribute('id');
      expect(label.getAttribute('for')).toBe(input.getAttribute('id'));
    });
  });

  describe('FormControl', () => {
    it('should render with default props', () => {
      const TestFormControl = () => {
        const form = useForm();
        return (
          <Form {...form}>
            <FormField
              control={form.control}
              name="test"
              render={() => (
                <FormItem>
                  <FormLabel>Test Label</FormLabel>
                  <FormControl>
                    <Input placeholder="Test input" />
                  </FormControl>
                </FormItem>
              )}
            />
          </Form>
        );
      };

      render(<TestFormControl />);

      const control = screen.getByTestId('form-control');
      expect(control).toBeInTheDocument();
    });

    it('should have proper ARIA attributes', () => {
      const TestFormControl = () => {
        const form = useForm();
        return (
          <Form {...form}>
            <FormField
              control={form.control}
              name="test"
              render={() => (
                <FormItem>
                  <FormLabel>Test Label</FormLabel>
                  <FormControl>
                    <Input placeholder="Test input" />
                  </FormControl>
                  <FormDescription>Test description</FormDescription>
                </FormItem>
              )}
            />
          </Form>
        );
      };

      render(<TestFormControl />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-describedby');
      expect(input).toHaveAttribute('aria-invalid', 'false');
    });

    it('should update ARIA attributes when field has error', async () => {
      const user = userEvent.setup();

      render(<TestForm />);

      const submitButton = screen.getByRole('button', { name: 'Submit' });
      await user.click(submitButton); // Trigger validation

      const usernameInput = screen.getByLabelText('Username');
      expect(usernameInput).toHaveAttribute('aria-invalid', 'true');
      expect(usernameInput).toHaveAttribute('aria-describedby');
    });
  });

  describe('FormDescription', () => {
    it('should render with default props', () => {
      const TestFormDescription = () => {
        const form = useForm();
        return (
          <Form {...form}>
            <FormField
              control={form.control}
              name="test"
              render={() => (
                <FormItem>
                  <FormLabel>Test Label</FormLabel>
                  <FormControl>
                    <Input />
                  </FormControl>
                  <FormDescription>This is a test description</FormDescription>
                </FormItem>
              )}
            />
          </Form>
        );
      };

      render(<TestFormDescription />);

      const description = screen.getByTestId('form-description');
      expect(description).toBeInTheDocument();
      expect(description).toHaveTextContent('This is a test description');
      expect(description).toHaveClass('text-sm', 'text-muted-foreground');
    });

    it('should render with custom className', () => {
      const TestFormDescription = () => {
        const form = useForm();
        return (
          <Form {...form}>
            <FormField
              control={form.control}
              name="test"
              render={() => (
                <FormItem>
                  <FormLabel>Test Label</FormLabel>
                  <FormControl>
                    <Input />
                  </FormControl>
                  <FormDescription className="custom-description">
                    Custom description
                  </FormDescription>
                </FormItem>
              )}
            />
          </Form>
        );
      };

      render(<TestFormDescription />);

      const description = screen.getByTestId('form-description');
      expect(description).toHaveClass('custom-description');
    });

    it('should have proper ID for accessibility', () => {
      const TestFormDescription = () => {
        const form = useForm();
        return (
          <Form {...form}>
            <FormField
              control={form.control}
              name="test"
              render={() => (
                <FormItem>
                  <FormLabel>Test Label</FormLabel>
                  <FormControl>
                    <Input />
                  </FormControl>
                  <FormDescription>Test description</FormDescription>
                </FormItem>
              )}
            />
          </Form>
        );
      };

      render(<TestFormDescription />);

      const description = screen.getByTestId('form-description');
      const input = screen.getByRole('textbox');

      expect(description).toHaveAttribute('id');
      expect(input.getAttribute('aria-describedby')).toContain(description.getAttribute('id'));
    });
  });

  describe('FormMessage', () => {
    it('should not render when there is no error or children', () => {
      const TestFormMessage = () => {
        const form = useForm();
        return (
          <Form {...form}>
            <FormField
              control={form.control}
              name="test"
              render={() => (
                <FormItem>
                  <FormLabel>Test Label</FormLabel>
                  <FormControl>
                    <Input />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Form>
        );
      };

      render(<TestFormMessage />);

      expect(screen.queryByTestId('form-message')).not.toBeInTheDocument();
    });

    it('should render error message when field has error', async () => {
      const user = userEvent.setup();

      render(<TestForm />);

      const submitButton = screen.getByRole('button', { name: 'Submit' });
      await user.click(submitButton); // Trigger validation

      const errorMessages = screen.getAllByTestId('form-message');
      const usernameError = errorMessages.find(msg =>
        msg.textContent?.includes('Username must be at least 2 characters.')
      );

      expect(usernameError).toBeInTheDocument();
      expect(usernameError).toHaveTextContent('Username must be at least 2 characters.');
      expect(usernameError).toHaveClass('text-sm', 'font-medium', 'text-destructive');
    });

    it('should render custom children when provided', () => {
      const TestFormMessage = () => {
        const form = useForm();
        return (
          <Form {...form}>
            <FormField
              control={form.control}
              name="test"
              render={() => (
                <FormItem>
                  <FormLabel>Test Label</FormLabel>
                  <FormControl>
                    <Input />
                  </FormControl>
                  <FormMessage>Custom message</FormMessage>
                </FormItem>
              )}
            />
          </Form>
        );
      };

      render(<TestFormMessage />);

      const message = screen.getByTestId('form-message');
      expect(message).toBeInTheDocument();
      expect(message).toHaveTextContent('Custom message');
    });

    it('should have proper ID for accessibility', async () => {
      const user = userEvent.setup();

      render(<TestForm />);

      const submitButton = screen.getByRole('button', { name: 'Submit' });
      await user.click(submitButton); // Trigger validation

      const errorMessages = screen.getAllByTestId('form-message');
      const usernameError = errorMessages.find(msg =>
        msg.textContent?.includes('Username must be at least 2 characters.')
      );
      const input = screen.getByLabelText('Username');

      expect(usernameError).toHaveAttribute('id');
      expect(input.getAttribute('aria-describedby')).toContain(usernameError?.getAttribute('id'));
    });

    it('should render with custom className', () => {
      const TestFormMessage = () => {
        const form = useForm();
        return (
          <Form {...form}>
            <FormField
              control={form.control}
              name="test"
              render={() => (
                <FormItem>
                  <FormLabel>Test Label</FormLabel>
                  <FormControl>
                    <Input />
                  </FormControl>
                  <FormMessage className="custom-message">Custom message</FormMessage>
                </FormItem>
              )}
            />
          </Form>
        );
      };

      render(<TestFormMessage />);

      const message = screen.getByTestId('form-message');
      expect(message).toHaveClass('custom-message');
    });
  });

  describe('Accessibility', () => {
    it('should have proper form accessibility structure', () => {
      render(<TestForm />);

      const form = screen.getByRole('form');
      const usernameInput = screen.getByLabelText('Username');
      const emailInput = screen.getByLabelText('Email');
      const ageInput = screen.getByLabelText('Age');

      expect(form).toBeInTheDocument();
      expect(usernameInput).toHaveAttribute('aria-describedby');
      expect(emailInput).toHaveAttribute('aria-describedby');
      expect(ageInput).toHaveAttribute('aria-describedby');
    });

    it('should announce errors to screen readers', async () => {
      const user = userEvent.setup();

      render(<TestForm />);

      const submitButton = screen.getByRole('button', { name: 'Submit' });
      await user.click(submitButton);

      const errorMessages = screen.getAllByTestId('form-message');
      errorMessages.forEach(message => {
        expect(message).toHaveAttribute('id');
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle form with no validation', () => {
      const SimpleForm = () => {
        const form = useForm({
          defaultValues: {
            name: "",
          },
        });

        return (
          <Form {...form}>
            <form>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        );
      };

      render(<SimpleForm />);

      expect(screen.getByLabelText('Name')).toBeInTheDocument();
      expect(screen.queryByTestId('form-message')).not.toBeInTheDocument();
    });

    it('should combine custom classes with base classes', () => {
      const CustomForm = () => {
        const form = useForm();
        return (
          <Form {...form}>
            <FormField
              control={form.control}
              name="test"
              render={() => (
                <FormItem className="custom-item">
                  <FormLabel className="custom-label">Test Label</FormLabel>
                  <FormControl>
                    <Input className="custom-input" />
                  </FormControl>
                  <FormDescription className="custom-description">
                    Test description
                  </FormDescription>
                  <FormMessage className="custom-message">Test message</FormMessage>
                </FormItem>
              )}
            />
          </Form>
        );
      };

      render(<CustomForm />);

      const item = screen.getByTestId('form-item');
      const label = screen.getByTestId('form-label');
      const description = screen.getByTestId('form-description');
      const message = screen.getByTestId('form-message');

      expect(item).toHaveClass('space-y-2', 'custom-item');
      expect(label).toHaveClass('custom-label');
      expect(description).toHaveClass('text-sm', 'custom-description');
      expect(message).toHaveClass('text-sm', 'custom-message');
    });
  });
});
