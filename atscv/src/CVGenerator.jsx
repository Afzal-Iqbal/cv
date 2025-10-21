import React, { useState, useCallback, useEffect } from 'react';
import {
  Plus,
  Trash2,
  User,
  Briefcase,
  GraduationCap,
  Zap,
  Github,
  Linkedin,
  Mail,
  Phone,
  ExternalLink,
  Menu,
  Rocket,
  Download
} from 'lucide-react';

// --- Data Structure ---
const initialCVData = {
  personal: {
    name: 'Jane Doe',
    title: 'Senior Full Stack Developer',
    phone: '555-123-4567',
    email: 'jane.doe@example.com',
    linkedin: 'linkedin.com/in/janedoe',
    github: 'github.com/janedoe',
    summary:
      'Highly motivated and results-driven engineer with 8+ years of experience in full-stack development and cloud architecture. Proven ability to lead projects, mentor teams, and deliver scalable solutions on time, adhering to best practices and clean code principles.',
  },
  education: [
    { id: 1, degree: 'M.S. Computer Science', institution: 'State University', year: '2015 - 2017' },
    { id: 2, degree: 'B.S. Software Engineering', institution: 'City College', year: '2011 - 2015' },
  ],
  experience: [
    {
      id: 1,
      title: 'Lead Software Engineer',
      company: 'Tech Corp Innovations',
      years: '2020 - Present',
      description: [
        'Led a team of 5 engineers in migrating core services to AWS Lambda, resulting in a 40% reduction in operational costs.',
        'Architected and deployed high-traffic REST APIs using Node.js and PostgreSQL, efficiently handling over 1 million daily requests.',
        'Mentored junior team members, improving team code quality and reducing integration errors by 25%.',
      ],
    },
    {
      id: 2,
      title: 'Full Stack Developer',
      company: 'Digital Solutions Inc.',
      years: '2017 - 2020',
      description: [
        'Developed front-end features using React and Redux, improving user experience across key application workflows.',
        'Collaborated with product teams to define and implement new features, ensuring technical feasibility and timely delivery.',
      ],
    },
  ],
  skills: {
    hard: 'React, Node.js, TypeScript, AWS (Lambda, S3, EC2), PostgreSQL, Docker, Kubernetes, CI/CD, Terraform',
    soft: 'Leadership, Agile Methodologies, Problem Solving, Mentoring, Cross-Functional Communication',
  },
};

// Utility to generate unique IDs
let nextId = 3;

// --- Helper Components ---

const PreviewSectionTitle = ({ icon: Icon, title }) => (
  <div className="flex items-center space-x-2 mb-2 pt-2 print:pt-0">
    <Icon className="w-5 h-5 text-indigo-600 print:text-indigo-600" />
    <h2
      className="text-xl font-bold tracking-wider text-gray-800 print:text-gray-800 uppercase"
      id={title.toLowerCase().replace(/\s/g, '-')}
    >
      {title}
    </h2>
  </div>
);

const FormInput = ({ label, id, value, onChange, type = 'text', placeholder = '' }) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <input
      type={type}
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
      placeholder={placeholder}
    />
  </div>
);

const FormTextarea = ({ label, id, value, onChange, placeholder = '', rows = 3 }) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <textarea
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
      placeholder={placeholder}
    />
  </div>
);

const ActionButton = ({
  onClick,
  icon: Icon,
  children,
  color = 'bg-indigo-600',
  hover = 'hover:bg-indigo-700',
  type = 'button',
  disabled = false,
  className = '',
  ...rest
}) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-md text-white ${color} ${hover} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out transform hover:scale-[1.02] ${
      disabled ? 'opacity-50 cursor-not-allowed hover:scale-100' : ''
    } ${className}`}
    {...rest}
  >
    {Icon && <Icon className="w-4 h-4 mr-2 animate-pulse-fast" />}
    {children}
  </button>
);

// --- Custom Modal ---
const ResetConfirmationModal = ({ onConfirm, onCancel, isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto print-hidden" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <Trash2 className="h-6 w-6 text-red-600" aria-hidden="true" />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  Reset CV Data
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Are you sure you want to reset all current CV data? This action will overwrite your changes with the initial
                    template and cannot be undone.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <ActionButton onClick={onConfirm} color="bg-red-600" hover="hover:bg-red-700" className="w-full sm:ml-3 sm:w-auto">
              Reset Data
            </ActionButton>
            <ActionButton onClick={onCancel} color="bg-gray-500" hover="hover:bg-gray-600" className="mt-3 w-full sm:mt-0 sm:w-auto">
              Cancel
            </ActionButton>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Navigation Bar ---
const NavBar = () => (
  <nav className="sticky top-0 z-10 bg-white shadow-xl mb-8 print-hidden rounded-b-xl border-b-4 border-indigo-500">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        <div className="flex-shrink-0 flex items-center">
          <Rocket className="h-6 w-6 text-indigo-600" />
          <span className="text-xl font-bold text-gray-900 ml-2">ATS CV Builder</span>
        </div>
        <div className="hidden md:flex md:items-center md:space-x-4">
          <a href="#summary" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition">Summary</a>
          <a href="#technical-skills" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition">Skills</a>
          <a href="#professional-experience" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition">Experience</a>
          <a href="#education" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition">Education</a>
          <span className="px-3 py-1 text-xs bg-indigo-100 text-indigo-700 rounded-full font-semibold">Future Tools 🚀</span>
        </div>
        <div className="md:hidden">
          <button className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  </nav>
);

// --- CV Preview (ATS-Friendly) ---
const CVPreview = ({ data }) => {
  const isExperienceValid = data.experience && data.experience.length > 0;
  const isEducationValid = data.education && data.education.length > 0;

  return (
    <div
      id="cv-document"
      className="p-6 md:p-8 lg:p-10 bg-white shadow-2xl rounded-xl min-h-full print:shadow-none print:p-4 print:border-none border border-gray-200"
    >
      <header className="mb-6 pb-2 border-b-2 border-gray-500 print:border-gray-500">
        <h1 className="text-4xl font-extrabold text-gray-900 print:text-gray-900 tracking-tight leading-none mb-1">
          {data.personal.name}
        </h1>
        <p className="text-xl font-semibold text-gray-600 print:text-gray-600 mb-4">{data.personal.title}</p>

        <ul className="flex flex-wrap items-center text-sm text-gray-600 print:text-gray-600">
          <li className="flex items-center mr-6 mb-1">
            <Mail className="w-4 h-4 mr-1 text-gray-600" />
            <a href={`mailto:${data.personal.email}`} className="hover:text-indigo-700" target="_blank" rel="noopener noreferrer">
              {data.personal.email}
            </a>
          </li>
          {data.personal.phone && (
            <li className="flex items-center mr-6 mb-1">
              <Phone className="w-4 h-4 mr-1 text-gray-600" />
              <span>{data.personal.phone}</span>
            </li>
          )}
          {data.personal.linkedin && (
            <li className="flex items-center mr-6 mb-1">
              <Linkedin className="w-4 h-4 mr-1 text-gray-600" />
              <a href={`https://${data.personal.linkedin}`} className="hover:text-indigo-700" target="_blank" rel="noopener noreferrer">
                LinkedIn <ExternalLink className="inline w-3 h-3 ml-1" />
              </a>
            </li>
          )}
          {data.personal.github && (
            <li className="flex items-center mb-1">
              <Github className="w-4 h-4 mr-1 text-gray-600" />
              <a href={`https://${data.personal.github}`} className="hover:text-indigo-700" target="_blank" rel="noopener noreferrer">
                GitHub <ExternalLink className="inline w-3 h-3 ml-1" />
              </a>
            </li>
          )}
        </ul>
      </header>

      {data.personal.summary && (
        <section className="mb-6" id="summary">
          <PreviewSectionTitle icon={User} title="Summary" />
          <p className="text-gray-700 leading-relaxed print:text-gray-700">{data.personal.summary}</p>
        </section>
      )}

      <section className="mb-6" id="technical-skills">
        <PreviewSectionTitle icon={Zap} title="Technical Skills" />
        {data.skills.hard && (
          <div className="mb-4">
            <h3 className="font-semibold text-gray-800 print:text-gray-800 mb-1">Core Competencies:</h3>
            <p className="text-gray-700 print:text-gray-700">{data.skills.hard}</p>
          </div>
        )}
        {data.skills.soft && (
          <div>
            <h3 className="font-semibold text-gray-800 print:text-gray-800 mb-1">Soft Skills:</h3>
            <p className="text-gray-700 print:text-gray-700">{data.skills.soft}</p>
          </div>
        )}
      </section>

      {isExperienceValid && (
        <section className="mb-6" id="professional-experience">
          <PreviewSectionTitle icon={Briefcase} title="Professional Experience" />
          {data.experience.map((job) => (
            <article key={job.id} className="mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 print:text-gray-800 leading-tight">{job.title}</h3>
                  <p className="text-md font-semibold text-gray-700 print:text-gray-700 leading-tight">{job.company}</p>
                </div>
                <p className="text-sm text-gray-600 print:text-gray-600 font-medium whitespace-nowrap">{job.years}</p>
              </div>
              <ul className="list-disc ml-5 mt-1 text-gray-700 print:text-gray-700 space-y-1">
                {job.description
                  .filter((d) => d)
                  .map((desc, index) => (
                    <li key={index} className="text-sm leading-relaxed">
                      {desc}
                    </li>
                  ))}
              </ul>
            </article>
          ))}
        </section>
      )}

      {isEducationValid && (
        <section className="mb-6" id="education">
          <PreviewSectionTitle icon={GraduationCap} title="Education" />
          {data.education.map((edu) => (
            <article key={edu.id} className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-gray-800 print:text-gray-800 leading-tight">{edu.degree}</h3>
                <p className="text-sm text-gray-700 print:text-gray-700">{edu.institution}</p>
              </div>
              <p className="text-sm text-gray-600 print:text-gray-600 font-medium whitespace-nowrap">{edu.year}</p>
            </article>
          ))}
        </section>
      )}
    </div>
  );
};

// --- Form Section Components ---
const EducationForm = ({ edu, index, update, remove }) => (
  <div className="p-4 border border-gray-300 rounded-lg mb-4 bg-gray-50">
    <h4 className="text-lg font-semibold text-gray-700 mb-3">Education #{index + 1}</h4>
    <FormInput label="Degree/Certification" id={`edu-degree-${edu.id}`} value={edu.degree} onChange={(value) => update({ ...edu, degree: value })} />
    <FormInput label="Institution/School" id={`edu-inst-${edu.id}`} value={edu.institution} onChange={(value) => update({ ...edu, institution: value })} />
    <FormInput label="Years Attended (e.g., 2015 - 2017)" id={`edu-year-${edu.id}`} value={edu.year} onChange={(value) => update({ ...edu, year: value })} />
    <div className="flex justify-end mt-4">
      <ActionButton onClick={() => remove(edu.id)} icon={Trash2} color="bg-red-500" hover="hover:bg-red-600">
        Remove Education
      </ActionButton>
    </div>
  </div>
);

const ExperienceForm = ({ job, index, update, remove }) => {
  const descString = job.description ? job.description.join('\n') : '';

  const handleDescriptionChange = (value) => {
    const newDescriptions = value
      .split('\n')
      .map((d) => d.trim())
      .filter((d) => d.length > 0);
    update({ ...job, description: newDescriptions });
  };

  return (
    <div className="p-4 border border-gray-300 rounded-lg mb-4 bg-gray-50">
      <h4 className="text-lg font-semibold text-gray-700 mb-3">Experience #{index + 1}</h4>
      <FormInput label="Job Title" id={`exp-title-${job.id}`} value={job.title} onChange={(value) => update({ ...job, title: value })} />
      <FormInput label="Company Name" id={`exp-company-${job.id}`} value={job.company} onChange={(value) => update({ ...job, company: value })} />
      <FormInput label="Years (e.g., 2020 - Present)" id={`exp-years-${job.id}`} value={job.years} onChange={(value) => update({ ...job, years: value })} />
      <FormTextarea
        label="Key Achievements (One bullet point per line for ATS compatibility)"
        id={`exp-desc-${job.id}`}
        value={descString}
        onChange={handleDescriptionChange}
        rows={5}
        placeholder="e.g., Led a project to completion, resulting in X savings."
      />
      <div className="flex justify-end mt-4">
        <ActionButton onClick={() => remove(job.id)} icon={Trash2} color="bg-red-500" hover="hover:bg-red-600">
          Remove Job
        </ActionButton>
      </div>
    </div>
  );
};

// --- Main App Component ---
const HTML_TO_IMAGE_CDN = 'https://cdn.jsdelivr.net/npm/html-to-image@1.11.11/dist/html-to-image.min.js';
const JSPDF_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';

const CVGenerator = () => {
  const [data, setData] = useState(() => {
    try {
      const savedData = localStorage.getItem('atsCvData');
      return savedData ? JSON.parse(savedData) : initialCVData;
    } catch (error) {
      console.error('Error loading state from localStorage:', error);
      return initialCVData;
    }
  });

  const [isDownloading, setIsDownloading] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [isPDFLibsLoaded, setIsPDFLibsLoaded] = useState(false);

  // Load html-to-image and jspdf (UMD) via CDN
  useEffect(() => {
    let cancelled = false;

    const hasLibs = () => !!(window.htmlToImage && window.jspdf && window.jspdf.jsPDF);

    if (hasLibs()) {
      setIsPDFLibsLoaded(true);
      return;
    }

    const loadScript = (src) =>
      new Promise((resolve, reject) => {
        let script = document.querySelector(`script[src="${src}"]`);
        if (script) {
          if (script.getAttribute('data-loaded') === 'true') {
            resolve();
          } else {
            const onLoad = () => {
              script.setAttribute('data-loaded', 'true');
              resolve();
            };
            script.addEventListener('load', onLoad, { once: true });
            script.addEventListener('error', () => reject(new Error(`Failed to load ${src}`)), { once: true });
          }
        } else {
          script = document.createElement('script');
          script.src = src;
          script.async = true;
          script.onload = () => {
            script.setAttribute('data-loaded', 'true');
            resolve();
          };
          script.onerror = () => reject(new Error(`Failed to load ${src}`));
          document.head.appendChild(script);
        }
      });

    Promise.all([loadScript(HTML_TO_IMAGE_CDN), loadScript(JSPDF_CDN)])
      .then(() => {
        if (!cancelled && hasLibs()) setIsPDFLibsLoaded(true);
      })
      .catch((err) => console.error('Failed to load PDF libs:', err));

    return () => {
      cancelled = true;
    };
  }, []);

  const updateData = (newData) => {
    setData(newData);
    try {
      localStorage.setItem('atsCvData', JSON.stringify(newData));
    } catch (error) {
      console.error('Error saving state to localStorage:', error);
    }
  };

  const handlePersonalChange = useCallback(
    (field, value) => {
      updateData({
        ...data,
        personal: {
          ...data.personal,
          [field]: value,
        },
      });
    },
    [data]
  );

  const handleSkillsChange = useCallback(
    (category, value) => {
      updateData({
        ...data,
        skills: {
          ...data.skills,
          [category]: value,
        },
      });
    },
    [data]
  );

  // Education handlers
  const handleAddEducation = () => {
    const newId = nextId++;
    updateData({
      ...data,
      education: [...data.education, { id: newId, degree: '', institution: '', year: '' }],
    });
  };

  const handleUpdateEducation = (updatedEdu) => {
    updateData({
      ...data,
      education: data.education.map((edu) => (edu.id === updatedEdu.id ? updatedEdu : edu)),
    });
  };

  const handleRemoveEducation = (id) => {
    updateData({
      ...data,
      education: data.education.filter((edu) => edu.id !== id),
    });
  };

  // Experience handlers
  const handleAddExperience = () => {
    const newId = nextId++;
    updateData({
      ...data,
      experience: [...data.experience, { id: newId, title: '', company: '', years: '', description: [''] }],
    });
  };

  const handleUpdateExperience = (updatedJob) => {
    updateData({
      ...data,
      experience: data.experience.map((job) => (job.id === updatedJob.id ? updatedJob : job)),
    });
  };

  const handleRemoveExperience = (id) => {
    updateData({
      ...data,
      experience: data.experience.filter((job) => job.id !== id),
    });
  };

  // --- PDF Download Handler using html-to-image + jsPDF ---
  const handleDownloadPDF = async () => {
    if (!isPDFLibsLoaded) {
      alert('PDF generation tools are still loading. Please wait a moment and try again.');
      return;
    }

    setIsDownloading(true);

    try {
      const element = document.getElementById('cv-document');
      if (!element) throw new Error('#cv-document not found');

      const { jsPDF } = window.jspdf || {};
      const hti = window.htmlToImage;

      if (!jsPDF || !hti) throw new Error('PDF libraries are not available');

      // Ensure web fonts are ready to avoid missing glyphs
      await (document.fonts?.ready ?? Promise.resolve());

      const margin = 10; // mm
      const pageWidth = 210; // A4 width mm
      const pageHeight = 297; // A4 height mm
      const contentWidth = pageWidth - margin * 2;
      const contentHeight = pageHeight - margin * 2;

      // Render the element to an image (png) using html-to-image
      const pixelRatio = 2; // increase for sharper text, balance with memory
      const dataUrl = await hti.toPng(element, {
        pixelRatio,
        cacheBust: true,
        backgroundColor: '#ffffff',
        // You can exclude elements if needed:
        // filter: (node) => !(node.classList && node.classList.contains('print-hidden'))
      });

      // Load the dataURL as an Image to get its intrinsic dimensions
      const loadImage = (src) =>
        new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = src;
        });

      const img = await loadImage(dataUrl);

      // Compute mm-per-px to fit width to A4 content area
      const mmPerPx = contentWidth / img.width;
      const pageHeightPx = Math.floor(contentHeight / mmPerPx);

      const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'p', compress: true });

      // Slice the tall image into page-height chunks
      const pageCanvas = document.createElement('canvas');
      const ctx = pageCanvas.getContext('2d');
      pageCanvas.width = img.width;

      let sY = 0;
      let isFirst = true;

      while (sY < img.height) {
        const sliceHeightPx = Math.min(pageHeightPx, img.height - sY);
        pageCanvas.height = sliceHeightPx;

        ctx.clearRect(0, 0, pageCanvas.width, pageCanvas.height);
        // drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh)
        ctx.drawImage(img, 0, sY, img.width, sliceHeightPx, 0, 0, pageCanvas.width, sliceHeightPx);

        const chunkDataUrl = pageCanvas.toDataURL('image/png', 1.0);
        const chunkHeightMM = sliceHeightPx * mmPerPx;

        if (!isFirst) pdf.addPage();
        pdf.addImage(chunkDataUrl, 'PNG', margin, margin, contentWidth, chunkHeightMM);

        isFirst = false;
        sY += sliceHeightPx;
      }

      // Add page numbers
      const pageCount = pdf.getNumberOfPages();
      pdf.setFontSize(9);
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.text(`${i}/${pageCount}`, pageWidth - 6, pageHeight - 6, { align: 'right' });
      }

      const fileName =
        `${(data?.personal?.name || 'My')}`.trim().replace(/\s+/g, '_').replace(/[^\w\-]+/g, '') + '_CV.pdf';
      pdf.save(fileName);
    } catch (error) {
      console.error('Error during PDF generation:', error);
      alert('An unexpected error occurred during PDF generation. Check the console for details.');
    } finally {
      setIsDownloading(false);
    }
  };

  // Reset modal handlers
  const handleReset = () => setShowResetModal(true);
  const confirmReset = () => {
    updateData(initialCVData);
    setShowResetModal(false);
  };
  const cancelReset = () => setShowResetModal(false);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <style>{`
        @keyframes pulse-fast {
          0%, 100% { opacity: 1; }
          50% { opacity: .5; }
        }
        .animate-pulse-fast {
          animation: pulse-fast 1s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @media print {
          .print-hidden { display: none !important; }
          #cv-document {
            width: 100%;
            max-width: none;
            box-shadow: none;
            margin: 0;
            padding: 0;
            border: none;
            font-size: 11pt;
          }
          .main-grid { grid-template-columns: 1fr !important; }
          h1, h2, h3, p, ul, li { margin: 0; padding: 0; }
        }
      `}</style>

      <NavBar />

      <div className="p-4 sm:p-8">
        <h1 className="text-3xl font-extrabold text-center text-indigo-700 mb-8 print-hidden">ATS-Approved CV Generator</h1>

        <div className="main-grid grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-12 max-w-7xl mx-auto">
          {/* Left: Form */}
          <div className="md:col-span-2 print-hidden bg-white p-6 rounded-xl shadow-lg border border-gray-100 h-fit">
            <div className="space-y-8">
              <div className="flex justify-between space-x-4 pb-4 border-b border-gray-200">
                <ActionButton
                  onClick={handleDownloadPDF}
                  icon={isDownloading ? Rocket : Download}
                  color="bg-green-600"
                  hover="hover:bg-green-700"
                  disabled={isDownloading || !isPDFLibsLoaded}
                >
                  {isDownloading ? 'Generating PDF...' : !isPDFLibsLoaded ? 'Loading PDF Tools...' : 'Download PDF'}
                </ActionButton>
                <ActionButton onClick={handleReset} icon={Trash2} color="bg-red-500" hover="hover:bg-red-600">
                  Reset Template
                </ActionButton>
              </div>

              {/* Personal */}
              <section>
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2 text-indigo-500" /> Personal Information
                </h2>
                <FormInput label="Full Name" id="name" value={data.personal.name} onChange={(v) => handlePersonalChange('name', v)} />
                <FormInput label="Professional Title" id="title" value={data.personal.title} onChange={(v) => handlePersonalChange('title', v)} />
                <FormInput label="Phone" id="phone" value={data.personal.phone} onChange={(v) => handlePersonalChange('phone', v)} />
                <FormInput label="Email" id="email" value={data.personal.email} onChange={(v) => handlePersonalChange('email', v)} />
                <FormInput label="LinkedIn URL (e.g., linkedin.com/in/user)" id="linkedin" value={data.personal.linkedin} onChange={(v) => handlePersonalChange('linkedin', v)} />
                <FormInput label="GitHub URL (e.g., github.com/user)" id="github" value={data.personal.github} onChange={(v) => handlePersonalChange('github', v)} />
                <FormTextarea
                  label="Professional Summary (ATS focus: Use keywords!)"
                  id="summary"
                  value={data.personal.summary}
                  onChange={(v) => handlePersonalChange('summary', v)}
                  rows={4}
                />
              </section>

              {/* Skills */}
              <section>
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-indigo-500" /> Skills & Competencies
                </h2>
                <FormTextarea
                  label="Hard Skills (Comma separated: HTML, CSS, React)"
                  id="hard-skills"
                  value={data.skills.hard}
                  onChange={(v) => handleSkillsChange('hard', v)}
                  rows={3}
                />
                <FormTextarea
                  label="Soft Skills (Comma separated: Leadership, Mentoring)"
                  id="soft-skills"
                  value={data.skills.soft}
                  onChange={(v) => handleSkillsChange('soft', v)}
                  rows={2}
                />
              </section>

              {/* Experience */}
              <section>
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <Briefcase className="w-5 h-5 mr-2 text-indigo-500" /> Professional Experience
                </h2>
                {data.experience.map((job, index) => (
                  <ExperienceForm key={job.id} job={job} index={index} update={handleUpdateExperience} remove={handleRemoveExperience} />
                ))}
                <div className="flex justify-start">
                  <ActionButton onClick={handleAddExperience} icon={Plus} color="bg-green-600" hover="hover:bg-green-700">
                    Add Experience
                  </ActionButton>
                </div>
              </section>

              {/* Education */}
              <section>
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <GraduationCap className="w-5 h-5 mr-2 text-indigo-500" /> Education
                </h2>
                {data.education.map((edu, index) => (
                  <EducationForm key={edu.id} edu={edu} index={index} update={handleUpdateEducation} remove={handleRemoveEducation} />
                ))}
                <div className="flex justify-start">
                  <ActionButton onClick={handleAddEducation} icon={Plus} color="bg-green-600" hover="hover:bg-green-700">
                    Add Education
                  </ActionButton>
                </div>
              </section>
            </div>
          </div>

          {/* Right: Preview */}
          <div className="md:col-span-3">
            <CVPreview data={data} />
          </div>
        </div>
      </div>

      <ResetConfirmationModal isOpen={showResetModal} onConfirm={confirmReset} onCancel={cancelReset} />
    </div>
  );
};

export default CVGenerator;