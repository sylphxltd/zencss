use swc_core::{
    ecma::{
        ast::*,
        visit::{VisitMut, VisitMutWith},
    },
    plugin::{plugin_transform, proxies::TransformPluginProgramMetadata},
};
use serde::Deserialize;

/// Plugin configuration options
#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct Config {
    /// Enable production mode optimizations
    #[serde(default)]
    pub production: bool,

    /// Class name prefix
    #[serde(default = "default_prefix")]
    pub class_prefix: String,
}

fn default_prefix() -> String {
    "silk".to_string()
}

impl Default for Config {
    fn default() -> Self {
        Self {
            production: false,
            class_prefix: default_prefix(),
        }
    }
}

/// Main transform visitor
pub struct SilkTransformVisitor {
    config: Config,
}

impl SilkTransformVisitor {
    pub fn new(config: Config) -> Self {
        Self { config }
    }
}

impl VisitMut for SilkTransformVisitor {
    /// Visit call expressions to find css() calls
    fn visit_mut_call_expr(&mut self, node: &mut CallExpr) {
        // First visit children
        node.visit_mut_children_with(self);

        // Check if this is a css() call
        if is_css_call(node) {
            // TODO: Transform css({ bg: 'red' }) → 'silk_bg_red_hash'
            // TODO: Collect CSS rules for later emission

            // For now, log that we found a css() call
            // In production, we'll replace this with actual transformation
        }
    }
}

/// Check if a CallExpr is a css() function call
fn is_css_call(call: &CallExpr) -> bool {
    match &call.callee {
        Callee::Expr(expr) => match &**expr {
            Expr::Ident(ident) => {
                // Direct call: css()
                ident.sym.as_ref() == "css"
            }
            Expr::Member(member) => {
                // Member call: styled.css() or system.css()
                match &member.prop {
                    MemberProp::Ident(ident) => ident.sym.as_ref() == "css",
                    _ => false,
                }
            }
            _ => false,
        },
        _ => false,
    }
}

/// SWC plugin entry point
#[plugin_transform]
pub fn process_transform(program: Program, metadata: TransformPluginProgramMetadata) -> Program {
    let config = metadata
        .get_transform_plugin_config()
        .and_then(|json_str| serde_json::from_str::<Config>(&json_str).ok())
        .unwrap_or_default();

    program.apply(SilkTransformVisitor::new(config))
}

// Apply the visitor to the program
trait Apply {
    fn apply(self, visitor: SilkTransformVisitor) -> Self;
}

impl Apply for Program {
    fn apply(mut self, mut visitor: SilkTransformVisitor) -> Self {
        self.visit_mut_with(&mut visitor);
        self
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_config_default() {
        let config = Config::default();
        assert_eq!(config.production, false);
        assert_eq!(config.class_prefix, "silk");
    }

    #[test]
    fn test_config_deserialize() {
        let json = r#"{"production": true, "classPrefix": "custom"}"#;
        let config: Config = serde_json::from_str(json).unwrap();
        assert_eq!(config.production, true);
        assert_eq!(config.class_prefix, "custom");
    }
}
