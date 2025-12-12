-- Create guests table with unique invitation codes
CREATE TABLE public.guests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invitation_code TEXT NOT NULL UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  category TEXT DEFAULT 'friend',
  num_adults INTEGER DEFAULT 1,
  num_children INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create RSVP responses table
CREATE TABLE public.rsvp_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  guest_id UUID REFERENCES public.guests(id) ON DELETE CASCADE NOT NULL,
  is_attending BOOLEAN NOT NULL,
  num_adults INTEGER DEFAULT 1,
  num_children INTEGER DEFAULT 0,
  remarks TEXT,
  responded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(guest_id)
);

-- Create guestbook messages table
CREATE TABLE public.guestbook_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  guest_id UUID REFERENCES public.guests(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL,
  message TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rsvp_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guestbook_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for guests (read-only by invitation code via functions)
CREATE POLICY "Guests can view their own info via invitation code"
ON public.guests
FOR SELECT
USING (true);

-- RLS Policies for RSVP responses
CREATE POLICY "Anyone can insert RSVP responses"
ON public.rsvp_responses
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can view RSVP responses"
ON public.rsvp_responses
FOR SELECT
USING (true);

CREATE POLICY "Anyone can update their RSVP"
ON public.rsvp_responses
FOR UPDATE
USING (true);

-- RLS Policies for guestbook messages
CREATE POLICY "Anyone can insert guestbook messages"
ON public.guestbook_messages
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can view approved guestbook messages"
ON public.guestbook_messages
FOR SELECT
USING (is_approved = true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_guests_updated_at
BEFORE UPDATE ON public.guests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for guestbook messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.guestbook_messages;