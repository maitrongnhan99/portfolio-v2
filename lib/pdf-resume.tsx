import { Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';
import { ResumeData } from './resume-data';

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 11,
    paddingTop: 30,
    paddingLeft: 40,
    paddingRight: 40,
    paddingBottom: 30,
    lineHeight: 1.5,
    backgroundColor: '#ffffff',
  },
  header: {
    textAlign: 'center',
    marginBottom: 25,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1a202c',
  },
  contactLinks: {
    fontSize: 11,
    marginBottom: 5,
    color: '#2563eb',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  contactInfo: {
    fontSize: 11,
    color: '#4a5568',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  divider: {
    borderBottom: 1,
    borderBottomColor: '#e2e8f0',
    marginVertical: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1a202c',
    borderBottom: 1,
    borderBottomColor: '#e2e8f0',
    paddingBottom: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  sectionEmoji: {
    fontSize: 14,
  },
  sectionContent: {
    fontSize: 11,
    lineHeight: 1.4,
    color: '#2d3748',
  },
  // Summary styles
  summaryText: {
    fontSize: 11,
    lineHeight: 1.5,
    color: '#2d3748',
    textAlign: 'justify',
  },
  // Tech stack styles
  techStack: {
    marginBottom: 6,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  techCategory: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1a202c',
    width: 80,
    marginRight: 10,
  },
  techItems: {
    fontSize: 11,
    color: '#2d3748',
    flex: 1,
  },
  // Experience styles
  experienceItem: {
    marginBottom: 15,
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 5,
  },
  jobTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1a202c',
  },
  company: {
    fontSize: 11,
    color: '#4a5568',
    marginBottom: 2,
  },
  duration: {
    fontSize: 10,
    color: '#6b7280',
    textAlign: 'right',
  },
  bulletPoint: {
    fontSize: 10,
    marginLeft: 12,
    marginBottom: 3,
    color: '#374151',
    lineHeight: 1.4,
  },
  // Projects styles
  projectItem: {
    marginBottom: 12,
  },
  projectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 5,
  },
  projectEmoji: {
    fontSize: 12,
  },
  projectName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1a202c',
  },
  projectLinks: {
    fontSize: 9,
    color: '#2563eb',
    marginLeft: 'auto',
  },
  projectDescription: {
    fontSize: 10,
    color: '#374151',
    marginBottom: 4,
    lineHeight: 1.4,
  },
  projectTechs: {
    fontSize: 9,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  // Education styles
  educationItem: {
    marginBottom: 10,
  },
  educationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 2,
  },
  degree: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1a202c',
  },
  institution: {
    fontSize: 11,
    color: '#4a5568',
  },
  // Certifications styles
  certificationItem: {
    marginBottom: 4,
    fontSize: 10,
    color: '#374151',
  },
  certificationName: {
    fontWeight: 'bold',
  },
  // Languages styles
  languageItem: {
    marginBottom: 4,
    fontSize: 10,
    color: '#374151',
    flexDirection: 'row',
  },
  languageName: {
    fontWeight: 'bold',
    marginRight: 5,
  },
  link: {
    color: '#2563eb',
    textDecoration: 'underline',
  },
});

interface PDFResumeProps {
  data: ResumeData;
}

export const PDFResume = ({ data }: PDFResumeProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.name}>{data.personalInfo.name}</Text>
        <View style={styles.contactLinks}>
          <Link src={data.personalInfo.links.linkedin} style={styles.link}>
            LinkedIn
          </Link>
          <Text> • </Text>
          <Link src={data.personalInfo.links.github} style={styles.link}>
            GitHub
          </Link>
          <Text> • </Text>
          <Link src={data.personalInfo.links.portfolio} style={styles.link}>
            Portfolio
          </Link>
        </View>
        <View style={styles.contactInfo}>
          <View style={styles.contactItem}>
            <Text>📧 {data.personalInfo.contacts.email}</Text>
          </View>
          <View style={styles.contactItem}>
            <Text>📍 {data.personalInfo.contacts.location}</Text>
          </View>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Summary */}
      <View style={styles.section}>
        <View style={styles.sectionTitle}>
          <Text style={styles.sectionEmoji}>🧑‍💻</Text>
          <Text>Summary</Text>
        </View>
        <Text style={styles.summaryText}>{data.summary.content}</Text>
      </View>

      {/* Tech Stack */}
      <View style={styles.section}>
        <View style={styles.sectionTitle}>
          <Text style={styles.sectionEmoji}>🛠️</Text>
          <Text>Tech Stack</Text>
        </View>
        <View style={styles.techStack}>
          <Text style={styles.techCategory}>Languages:</Text>
          <Text style={styles.techItems}>{data.techStack.languages.join(', ')}</Text>
        </View>
        <View style={styles.techStack}>
          <Text style={styles.techCategory}>Frontend:</Text>
          <Text style={styles.techItems}>{data.techStack.frontend.join(', ')}</Text>
        </View>
        <View style={styles.techStack}>
          <Text style={styles.techCategory}>Backend:</Text>
          <Text style={styles.techItems}>{data.techStack.backend.join(', ')}</Text>
        </View>
        <View style={styles.techStack}>
          <Text style={styles.techCategory}>Database:</Text>
          <Text style={styles.techItems}>{data.techStack.database.join(', ')}</Text>
        </View>
        <View style={styles.techStack}>
          <Text style={styles.techCategory}>DevOps:</Text>
          <Text style={styles.techItems}>{data.techStack.devOps.join(', ')}</Text>
        </View>
        <View style={styles.techStack}>
          <Text style={styles.techCategory}>Testing:</Text>
          <Text style={styles.techItems}>{data.techStack.testing.join(', ')}</Text>
        </View>
      </View>

      {/* Experience */}
      <View style={styles.section}>
        <View style={styles.sectionTitle}>
          <Text style={styles.sectionEmoji}>🏢</Text>
          <Text>Experience</Text>
        </View>
        {data.experience.map((job, index) => (
          <View key={index} style={styles.experienceItem}>
            <View style={styles.experienceHeader}>
              <View>
                <Text style={styles.jobTitle}>{job.position} — {job.company}</Text>
                <Text style={styles.company}>{job.location}</Text>
              </View>
              <Text style={styles.duration}>{job.duration}</Text>
            </View>
            {job.bullets.map((bullet, bulletIndex) => (
              <Text key={bulletIndex} style={styles.bulletPoint}>
                • {bullet.description}
              </Text>
            ))}
          </View>
        ))}
      </View>

      {/* Projects */}
      <View style={styles.section}>
        <View style={styles.sectionTitle}>
          <Text style={styles.sectionEmoji}>📂</Text>
          <Text>Projects</Text>
        </View>
        {data.projects.map((project, index) => (
          <View key={index} style={styles.projectItem}>
            <View style={styles.projectHeader}>
              <Text style={styles.projectEmoji}>{project.emoji}</Text>
              <Text style={styles.projectName}>{project.name}</Text>
              <View style={styles.projectLinks}>
                {project.links.github && (
                  <Link src={project.links.github} style={styles.link}>
                    [GitHub]
                  </Link>
                )}
                {project.links.live && (
                  <Link src={project.links.live} style={styles.link}>
                    {project.links.github ? ' [Live]' : '[Live]'}
                  </Link>
                )}
              </View>
            </View>
            <Text style={styles.projectDescription}>{project.description}</Text>
            <Text style={styles.projectTechs}>
              Technologies: {project.technologies.join(', ')}
            </Text>
          </View>
        ))}
      </View>

      {/* Education */}
      <View style={styles.section}>
        <View style={styles.sectionTitle}>
          <Text style={styles.sectionEmoji}>📜</Text>
          <Text>Education</Text>
        </View>
        {data.education.map((edu, index) => (
          <View key={index} style={styles.educationItem}>
            <View style={styles.educationHeader}>
              <View>
                <Text style={styles.degree}>{edu.degree}</Text>
                <Text style={styles.institution}>{edu.institution} — {edu.location}</Text>
              </View>
              <Text style={styles.duration}>{edu.duration}</Text>
            </View>
            {edu.gpa && (
              <Text style={styles.bulletPoint}>GPA: {edu.gpa}</Text>
            )}
          </View>
        ))}
      </View>

      {/* Certifications */}
      {data.certifications && data.certifications.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionTitle}>
            <Text style={styles.sectionEmoji}>🧾</Text>
            <Text>Certifications</Text>
          </View>
          {data.certifications.map((cert, index) => (
            <Text key={index} style={styles.certificationItem}>
              • <Text style={styles.certificationName}>{cert.name}</Text> — {cert.issuer}, {cert.date}
            </Text>
          ))}
        </View>
      )}

      {/* Languages */}
      <View style={styles.section}>
        <View style={styles.sectionTitle}>
          <Text style={styles.sectionEmoji}>🧰</Text>
          <Text>Languages</Text>
        </View>
        {data.languages.map((lang, index) => (
          <View key={index} style={styles.languageItem}>
            <Text style={styles.languageName}>{lang.language}:</Text>
            <Text>{lang.proficiency}</Text>
            {lang.certification && <Text> ({lang.certification})</Text>}
          </View>
        ))}
      </View>
    </Page>
  </Document>
);