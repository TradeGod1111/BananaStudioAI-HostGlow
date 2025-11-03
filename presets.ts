export const PRESETS: Record<string, string[]> = {
  airbnb: [
    "Correct geometry first: keep verticals and horizontals parallel; fix keystoning.",
    "Balance exposure; lift shadows moderately without clipping highlights.",
    "Set neutral white balance with a slight warm bias; keep whites clean and consistent across images.",
    "Improve apparent resolution with conservative super-resolution (up to 2×).",
    "Enhance local contrast and clarity for textures (wood, textiles) without halos.",
    "Remove background clutter and reflections; fill areas naturally to match surrounding texture and color.",
    "Do not add or remove furniture or decor; perform only minor touch-ups.",
    "Overall mood: inviting and modern; protect midtones and any skin tones."
  ],
  booking: [
    "Correct geometry and enforce straight lines for a catalog look.",
    "Set a neutral/cool white balance; remove color casts from mixed lighting.",
    "Increase global contrast slightly; preserve midtone detail.",
    "Sharpen edges carefully; avoid halos and overshoot.",
    "Apply gentle noise reduction with fine-detail preservation.",
    "Remove mirror/glass distractions and fill seamlessly.",
    "No content additions; only distraction cleanup.",
    "Overall mood: clear, professional, information-first."
  ],
  realtor_zillow: [
    "Correct lens distortion; keep verticals parallel and horizontals level.",
    "Balance dynamic range to retain detail inside and through windows; avoid clipped highlights.",
    "Set neutral white balance across rooms for consistency.",
    "Boost micro-contrast on fixtures and finishes; preserve fine texture.",
    "Normalize mixed lighting (tungsten + daylight) toward neutral.",
    "Remove small distractions (cords, wall scuffs) and fill seamlessly.",
    "Do not fabricate features; maintain documentary accuracy.",
    "Overall mood: bright, accurate, trustworthy."
  ],
  hotels_hospitality: [
    "Correct geometry; maintain clean lines on walls and furniture.",
    "Balance exposure with soft highlight roll-off; keep blacks deep and clean.",
    "Neutral-to-warm white balance with subtle golden undertones.",
    "Enhance fabric sheen and surface depth without plasticity.",
    "Tidy linens and surfaces; remove small wrinkles or stains realistically.",
    "Reduce glare on glass while keeping natural specular life.",
    "No object additions; subtle refinement only.",
    "Overall mood: luxurious, calm, welcoming."
  ],
  restaurants: [
    "Correct geometry; keep tableware shapes true.",
    "Set neutral WB with a gentle warm lift; keep plates and linens neutral-white.",
    "Increase selective saturation/contrast for food while protecting natural colors.",
    "Control reflections and glare; keep highlights appetizing, not blown.",
    "Reduce background clutter; remove small distracting items on tables.",
    "Preserve realistic texture; avoid oversharpening.",
    "No added items; tasteful cleanup only.",
    "Overall mood: fresh, appetizing, intimate."
  ],
  product_listings: [
    "Center subject; correct geometry; prevent perspective warp.",
    "Set neutral WB; unify background to pure white or soft gray as appropriate.",
    "Control speculars; protect glossy highlight detail.",
    "Increase edge definition without halos; preserve material texture.",
    "Harmonize color to a provided reference; ensure brand-accurate hues.",
    "Remove dust, scratches, and lint; fill seamlessly with texture continuation.",
    "Add subtle contact shadow to avoid floating; no product shape changes.",
    "Overall mood: retail-ready, crisp, consistent."
  ],
  social_media: [
    "Correct geometry and crop for platform framing; protect skin tones.",
    "Lift exposure gently; add controlled midtone contrast.",
    "Apply color pop while preserving natural skin tones; avoid neon clipping.",
    "Optional: add a Lighting Look from the dropdown if selected.",
    "Remove minor distractions and blemishes; keep identity intact.",
    "Add a slight vignette to focus attention; avoid heavy filters.",
    "No object additions; tasteful cleanup only.",
    "Overall mood: scroll-stopping yet natural."
  ],
  fashion_portraits: [
    "Correct geometry and horizon; frame for portrait emphasis.",
    "Set WB for natural skin tones; keep hue/undertone consistent across the set.",
    "Apply soft, directional key-light simulation; add mild depth contrast.",
    "Retain pores and fine texture; avoid plastic skin; subtle dodge and burn only.",
    "Reduce temporary blemishes without removing identity features.",
    "Optional natural micro-contrast on eyes and lips; keep result subtle.",
    "Do not alter wardrobe or add elements.",
    "Overall mood: editorial, polished, authentic."
  ],
  architecture_interiors: [
    "Correct lens distortion and ensure parallel verticals; precise perspective control.",
    "Balance interior/exterior luminance; retain window detail without HDR artifacts.",
    "Normalize WB to neutral daylight across the set.",
    "Increase clarity and surface definition for materials (wood, stone, metal).",
    "Reduce glass glare; maintain realistic reflections and line continuity.",
    "Add subtle atmospheric depth through windows if appropriate.",
    "No structural fabrication or object additions.",
    "Overall mood: modern, high-definition, spatially accurate."
  ]
};